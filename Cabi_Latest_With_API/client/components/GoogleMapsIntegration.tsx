import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Navigation, Route as RouteIcon, Timer, DollarSign, Locate, Search } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';

interface GoogleMapsIntegrationProps {
  onLocationUpdate: (pickup: string, destination: string, distance: string, duration: string, fare: string, pickupCoords?: {lat: number, lng: number}, destinationCoords?: {lat: number, lng: number}) => void;
  pickupValue: string;
  destinationValue: string;
  onPickupChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
}

interface LocationSuggestion {
  place_id: string;
  description: string;
  formatted_address: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function GoogleMapsIntegration({
  onLocationUpdate,
  pickupValue,
  destinationValue,
  onPickupChange,
  onDestinationChange
}: GoogleMapsIntegrationProps) {
  const { addNotification } = useAppState();

  // Saved locations
  const savedLocations = [
    { name: 'Home', address: 'Koramangala 5th Block, Bangalore, Karnataka, India', icon: '🏠' },
    { name: 'Office', address: 'Electronic City Phase 1, Bangalore, Karnataka, India', icon: '🏢' },
    { name: 'Airport', address: 'Kempegowda International Airport, Devanahalli, Bangalore, Karnataka, India', icon: '✈️' }
  ];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const directionsServiceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const currentLocationMarkerRef = useRef<any>(null);
  const searchTimeoutRef = useRef<{pickup?: NodeJS.Timeout, destination?: NodeJS.Timeout}>({});
  const isMountedRef = useRef(true);
  
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{distance: string, duration: string, fare: string} | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [isSearchingDestination, setIsSearchingDestination] = useState(false);

  // Safe state setter that checks if component is still mounted
  const safeSetState = useCallback((setter: Function) => {
    if (isMountedRef.current) {
      setter();
    }
  }, []);

  // Initialize Google Maps in a completely isolated way
  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current || !window.google?.maps || mapInstanceRef.current) {
      return;
    }

    try {
      console.log('🗺️ Initializing Google Maps...');
      
      const mapInstance = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: 12.9716, lng: 77.5946 },
        zoom: 13,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [{ "color": "#212121" }]
          },
          {
            "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#757575" }]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#212121" }]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [{ "color": "#757575" }]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#2c2c2c" }]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#D89000" }]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#000000" }]
          }
        ]
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: '#D89000',
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      });

      directionsRenderer.setMap(mapInstance);

      // Store references
      mapInstanceRef.current = mapInstance;
      directionsServiceRef.current = directionsService;
      directionsRendererRef.current = directionsRenderer;

      safeSetState(() => setIsMapReady(true));
      console.log('✅ Google Maps initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing map:', error);
    }
  }, [safeSetState]);

  // Set up Google Maps initialization
  useEffect(() => {
    window.initMap = () => {
      setTimeout(initializeMap, 100);
    };

    if (window.google?.maps) {
      setTimeout(initializeMap, 100);
    }
  }, [initializeMap]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      
      // Clear timeouts
      Object.values(searchTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });

      // Clean up Google Maps objects
      try {
        if (currentLocationMarkerRef.current) {
          currentLocationMarkerRef.current.setMap(null);
        }
        if (directionsRendererRef.current) {
          directionsRendererRef.current.setMap(null);
        }
      } catch (error) {
        console.warn('Cleanup warning:', error);
      }
    };
  }, []);

  // Search for location suggestions
  const searchLocations = useCallback((query: string, isPickup: boolean) => {
    if (!query || query.length < 3 || !window.google?.maps) {
      safeSetState(() => {
        if (isPickup) {
          setPickupSuggestions([]);
          setShowPickupSuggestions(false);
          setIsSearchingPickup(false);
        } else {
          setDestinationSuggestions([]);
          setShowDestinationSuggestions(false);
          setIsSearchingDestination(false);
        }
      });
      return;
    }

    safeSetState(() => {
      if (isPickup) {
        setIsSearchingPickup(true);
      } else {
        setIsSearchingDestination(true);
      }
    });

    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({
      address: query,
      region: 'IN',
      componentRestrictions: { country: 'IN' }
    }, (results: any, status: any) => {
      if (!isMountedRef.current) return;

      safeSetState(() => {
        if (isPickup) {
          setIsSearchingPickup(false);
        } else {
          setIsSearchingDestination(false);
        }

        if (status === 'OK' && results?.length > 0) {
          const suggestions = results.slice(0, 5).map((result: any) => ({
            place_id: result.place_id,
            description: result.formatted_address,
            formatted_address: result.formatted_address
          }));

          if (isPickup) {
            setPickupSuggestions(suggestions);
            setShowPickupSuggestions(true);
          } else {
            setDestinationSuggestions(suggestions);
            setShowDestinationSuggestions(true);
          }
        }
      });
    });
  }, [safeSetState]);

  // Debounced search effects
  useEffect(() => {
    if (searchTimeoutRef.current.pickup) {
      clearTimeout(searchTimeoutRef.current.pickup);
    }
    
    if (pickupValue) {
      searchTimeoutRef.current.pickup = setTimeout(() => {
        searchLocations(pickupValue, true);
      }, 500);
    }
  }, [pickupValue, searchLocations]);

  useEffect(() => {
    if (searchTimeoutRef.current.destination) {
      clearTimeout(searchTimeoutRef.current.destination);
    }
    
    if (destinationValue) {
      searchTimeoutRef.current.destination = setTimeout(() => {
        searchLocations(destinationValue, false);
      }, 500);
    }
  }, [destinationValue, searchLocations]);

  // Current location detection
  const detectCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser. Please enter your location manually.');
      return;
    }

    safeSetState(() => setIsDetectingLocation(true));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isMountedRef.current) return;

        const { latitude, longitude } = position.coords;
        console.log(`📍 Location detected: ${latitude}, ${longitude}`);

        if (mapInstanceRef.current && window.google) {
          const location = new window.google.maps.LatLng(latitude, longitude);
          
          mapInstanceRef.current.setCenter(location);
          mapInstanceRef.current.setZoom(16);

          // Remove existing marker
          if (currentLocationMarkerRef.current) {
            currentLocationMarkerRef.current.setMap(null);
          }

          // Add new marker
          const marker = new window.google.maps.Marker({
            position: location,
            map: mapInstanceRef.current,
            title: "📍 You are here",
            animation: window.google.maps.Animation.DROP
          });

          currentLocationMarkerRef.current = marker;

          // Reverse geocoding
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: location }, (results: any, status: any) => {
            if (!isMountedRef.current) return;

            if (status === 'OK' && results?.[0]) {
              onPickupChange(results[0].formatted_address);
            } else {
              onPickupChange(`Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`);
            }
            
            safeSetState(() => setIsDetectingLocation(false));
          });
        }
      },
      (error) => {
        if (!isMountedRef.current) return;
        
        console.error('❌ Geolocation error:', error);
        safeSetState(() => setIsDetectingLocation(false));
        
        let errorMessage = 'Unable to detect your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access was denied.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        
        alert(errorMessage + ' Please enter your pickup location manually.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  }, [onPickupChange, safeSetState]);

  // Calculate route
  const calculateRoute = useCallback(() => {
    if (!directionsServiceRef.current || !directionsRendererRef.current || !pickupValue || !destinationValue) {
      return;
    }

    if (pickupValue.length < 3 || destinationValue.length < 3) {
      return;
    }

    // Validate that both addresses are not just names like "Home", "Office"
    const isValidAddress = (address: string) => {
      const invalidPatterns = /^(home|office|work|airport)$/i;
      return !invalidPatterns.test(address.trim()) && address.includes(',') || address.length > 10;
    };

    if (!isValidAddress(pickupValue) || !isValidAddress(destinationValue)) {
      console.warn('Invalid address format detected:', { pickup: pickupValue, destination: destinationValue });
      return;
    }

    const request = {
      origin: pickupValue,
      destination: destinationValue,
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    };

    directionsServiceRef.current.route(request, (result: any, status: any) => {
      if (!isMountedRef.current) return;

      if (status === 'OK' && result?.routes?.[0]) {
        try {
          directionsRendererRef.current.setDirections(result);
          
          const route = result.routes[0];
          const leg = route.legs[0];
          
          const distance = leg.distance.text;
          const duration = leg.duration.text;
          
          const distanceInKm = leg.distance.value / 1000;
          const durationInMin = leg.duration.value / 60;
          const fare = Math.round(distanceInKm * 10 + durationInMin * 2);
          const fareText = `₹${fare}`;

          // Extract coordinates from route
          const pickupCoords = {
            lat: leg.start_location.lat(),
            lng: leg.start_location.lng()
          };
          const destinationCoords = {
            lat: leg.end_location.lat(),
            lng: leg.end_location.lng()
          };

          safeSetState(() => {
            setRouteInfo({ distance, duration, fare: fareText });
          });

          onLocationUpdate(pickupValue, destinationValue, distance, duration, fareText, pickupCoords, destinationCoords);

          console.log('📊 Route calculated:', { distance, duration, fare: fareText, pickupCoords, destinationCoords });
        } catch (error) {
          console.error('❌ Error setting directions:', error);
        }
      } else {
        console.warn('❌ Directions request failed:', status, 'for route:', pickupValue, 'to', destinationValue);
        try {
          directionsRendererRef.current.setDirections({routes: []});
        } catch (error) {
          console.warn('Error clearing directions:', error);
        }
        safeSetState(() => setRouteInfo(null));

        // Show user-friendly error message
        if (status === 'NOT_FOUND') {
          addNotification({
            type: 'error',
            message: '❌ Route not found. Please enter complete addresses with city and state.'
          });
        } else if (status === 'ZERO_RESULTS') {
          addNotification({
            type: 'error',
            message: '❌ No route available between these locations.'
          });
        } else {
          addNotification({
            type: 'error',
            message: '❌ Unable to calculate route. Please check your addresses.'
          });
        }
      }
    });
  }, [pickupValue, destinationValue, onLocationUpdate, safeSetState]);

  // Auto-calculate route
  useEffect(() => {
    if (pickupValue && destinationValue && directionsServiceRef.current &&
        pickupValue.length > 10 && destinationValue.length > 10 &&
        pickupValue.includes(',') && destinationValue.includes(',')) {
      const timeout = setTimeout(calculateRoute, 1500);
      return () => clearTimeout(timeout);
    }
  }, [pickupValue, destinationValue, calculateRoute]);

  const handleSuggestionClick = useCallback((suggestion: LocationSuggestion, isPickup: boolean) => {
    if (isPickup) {
      onPickupChange(suggestion.formatted_address);
      safeSetState(() => setShowPickupSuggestions(false));
    } else {
      onDestinationChange(suggestion.formatted_address);
      safeSetState(() => setShowDestinationSuggestions(false));
    }
  }, [onPickupChange, onDestinationChange, safeSetState]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-suggestions]')) {
        safeSetState(() => {
          setShowPickupSuggestions(false);
          setShowDestinationSuggestions(false);
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [safeSetState]);

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=geometry&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
    return undefined;
  }, []);

  return (
    <div className="space-y-6">
      {/* Enhanced Location Inputs */}
      <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
        <h3 className="text-xl font-cabinet font-bold text-white mb-6">Smart Location Search</h3>
        
        {/* Pickup Input */}
        <div className="relative mb-4" data-suggestions>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cabinet-yellow w-5 h-5" />
            <input
              id="pickup"
              type="text"
              placeholder="Enter pickup location..."
              value={pickupValue}
              onChange={(e) => {
                onPickupChange(e.target.value);
                safeSetState(() => setShowPickupSuggestions(true));
              }}
              onFocus={() => safeSetState(() => setShowPickupSuggestions(pickupSuggestions.length > 0))}
              className="w-full pl-12 pr-20 py-4 glass-morphism rounded-2xl border border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow focus:outline-none focus:ring-2 focus:ring-cabinet-yellow/20 transition-all duration-300"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
              {isSearchingPickup && (
                <div className="p-2">
                  <Search className="w-4 h-4 text-cabinet-yellow animate-spin" />
                </div>
              )}
              <button
                onClick={detectCurrentLocation}
                disabled={isDetectingLocation}
                className={`p-2 rounded-xl transition-all duration-300 hover-lift magnetic group ${
                  isDetectingLocation
                    ? 'bg-cabinet-yellow/20 cursor-not-allowed opacity-50'
                    : 'glass-morphism border border-cabinet-yellow/30 hover:bg-cabinet-yellow hover:text-black'
                }`}
                title="Detect current location"
              >
                <Locate className={`w-4 h-4 transition-all duration-300 ${
                  isDetectingLocation
                    ? 'text-cabinet-yellow animate-spin'
                    : 'text-cabinet-yellow group-hover:text-black'
                }`} />
              </button>
            </div>
          </div>
          
          {/* Pickup Suggestions */}
          {showPickupSuggestions && pickupSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 glass-morphism rounded-xl border border-cabinet-yellow/30 overflow-hidden">
              {pickupSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion.place_id || index}
                  onClick={() => handleSuggestionClick(suggestion, true)}
                  className="w-full text-left px-4 py-3 text-white hover:bg-cabinet-yellow/20 transition-colors border-b border-cabinet-yellow/10 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-cabinet-yellow flex-shrink-0" />
                    <span className="text-sm">{suggestion.description}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination Input */}
        <div className="relative" data-suggestions>
          <div className="relative">
            <Navigation className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cabinet-light-yellow w-5 h-5" />
            <input
              id="drop"
              type="text"
              placeholder="Enter destination..."
              value={destinationValue}
              onChange={(e) => {
                onDestinationChange(e.target.value);
                safeSetState(() => setShowDestinationSuggestions(true));
              }}
              onFocus={() => safeSetState(() => setShowDestinationSuggestions(destinationSuggestions.length > 0))}
              className="w-full pl-12 pr-12 py-4 glass-morphism rounded-2xl border border-cabinet-yellow/30 text-white placeholder-cabinet-grey focus:border-cabinet-yellow focus:outline-none focus:ring-2 focus:ring-cabinet-yellow/20 transition-all duration-300"
            />
            {isSearchingDestination && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Search className="w-4 h-4 text-cabinet-yellow animate-spin" />
              </div>
            )}
          </div>
          
          {/* Destination Suggestions */}
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 glass-morphism rounded-xl border border-cabinet-yellow/30 overflow-hidden">
              {destinationSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion.place_id || index}
                  onClick={() => handleSuggestionClick(suggestion, false)}
                  className="w-full text-left px-4 py-3 text-white hover:bg-cabinet-yellow/20 transition-colors border-b border-cabinet-yellow/10 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <Navigation className="w-4 h-4 text-cabinet-light-yellow flex-shrink-0" />
                    <span className="text-sm">{suggestion.description}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Saved Locations */}
        <div className="mt-6">
          <h4 className="text-white font-medium mb-3">Quick Locations</h4>
          <div className="grid grid-cols-3 gap-3">
            {savedLocations.map((location) => (
              <button
                key={location.name}
                onClick={() => {
                  if (!pickupValue) onPickupChange(location.address);
                  else if (!destinationValue) onDestinationChange(location.address);
                }}
                className="glass-morphism border border-cabinet-yellow/20 p-3 rounded-xl hover:border-cabinet-yellow/50 transition-all duration-300 text-center group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">
                  {location.icon}
                </div>
                <div className="text-white text-xs font-medium">{location.name}</div>
                <div className="text-cabinet-grey text-xs">{location.address}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container - Completely isolated */}
      <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-cabinet font-bold text-white">Interactive Map</h3>
          <button
            id="detectLocationBtn"
            onClick={detectCurrentLocation}
            disabled={isDetectingLocation}
            className={`px-4 py-2 rounded-xl transition-all duration-300 hover-lift magnetic group flex items-center space-x-2 ${
              isDetectingLocation
                ? 'bg-cabinet-yellow/20 cursor-not-allowed opacity-50'
                : 'glass-morphism border border-cabinet-yellow/30 hover:bg-cabinet-yellow hover:text-black'
            }`}
          >
            <Locate className={`w-4 h-4 transition-all duration-300 ${
              isDetectingLocation
                ? 'text-cabinet-yellow animate-spin'
                : 'text-cabinet-yellow group-hover:text-black'
            }`} />
            <span className="text-cabinet-yellow group-hover:text-black font-medium">
              {isDetectingLocation ? 'Detecting...' : 'Current Location'}
            </span>
          </button>
        </div>
        
        {/* Isolated map container that React won't manage */}
        <div className="relative w-full h-96 rounded-2xl border border-cabinet-yellow/30 overflow-hidden">
          <div 
            id="map" 
            ref={mapContainerRef}
            className="w-full h-full"
          />
          {!isMapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-cabinet-yellow text-lg font-medium">
                🗺️ Loading Google Maps...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Route Information */}
      {routeInfo && (
        <div className="glass-morphism rounded-3xl p-6 border border-cabinet-yellow/20">
          <h3 className="text-xl font-cabinet font-bold text-white mb-4 flex items-center space-x-2">
            <RouteIcon className="w-5 h-5 text-cabinet-yellow" />
            <span>Route Information</span>
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <RouteIcon className="w-5 h-5 text-cabinet-yellow" />
                <span className="text-cabinet-grey text-sm">Distance</span>
              </div>
              <div id="distance" className="text-white font-bold text-lg">{routeInfo.distance}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Timer className="w-5 h-5 text-cabinet-light-yellow" />
                <span className="text-cabinet-grey text-sm">Duration</span>
              </div>
              <div id="duration" className="text-white font-bold text-lg">{routeInfo.duration}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-cabinet-gold" />
                <span className="text-cabinet-grey text-sm">Estimated Fare</span>
              </div>
              <div id="fare" className="text-cabinet-yellow font-bold text-xl">{routeInfo.fare}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
