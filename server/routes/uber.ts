import { RequestHandler } from "express";

const UBER_SERVER_TOKEN = 'ornsaB7vTLIcyA6iKG4rGhF0tKaidWSMKo_KmuyU';

// Get Uber price estimates
export const getUberPriceEstimates: RequestHandler = async (req, res) => {
  try {
    const { start_latitude, start_longitude, end_latitude, end_longitude } = req.query;

    if (!start_latitude || !start_longitude || !end_latitude || !end_longitude) {
      return res.status(400).json({ error: 'Missing required coordinates' });
    }

    console.log('🚗 Fetching Uber price estimates for:', { start_latitude, start_longitude, end_latitude, end_longitude });

    // For demo purposes, always use mock data to ensure reliability
    console.log('🎭 Using mock data for demo reliability');

    const mockData = generateMockPriceEstimates(
      parseFloat(start_latitude as string),
      parseFloat(start_longitude as string),
      parseFloat(end_latitude as string),
      parseFloat(end_longitude as string)
    );

    console.log('✅ Mock price estimates generated:', mockData);
    res.json(mockData);

    // Comment out real API call for demo
    /*
    const response = await fetch(
      `https://api.uber.com/v1/estimates/price?start_latitude=${start_latitude}&start_longitude=${start_longitude}&end_latitude=${end_latitude}&end_longitude=${end_longitude}`,
      {
        headers: {
          'Authorization': `Token ${UBER_SERVER_TOKEN}`,
          'Accept-Language': 'en_US',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Uber price estimates API error:', response.status, errorText);

      // Return mock data if API fails
      const mockData = generateMockPriceEstimates(
        parseFloat(start_latitude as string),
        parseFloat(start_longitude as string),
        parseFloat(end_latitude as string),
        parseFloat(end_longitude as string)
      );

      return res.json(mockData);
    }

    const data = await response.json();
    console.log('✅ Uber price estimates received:', data);
    res.json(data);
    */

  } catch (error) {
    console.error('❌ Error fetching Uber price estimates:', error);
    
    // Return mock data on error
    const { start_latitude, start_longitude, end_latitude, end_longitude } = req.query;
    const mockData = generateMockPriceEstimates(
      parseFloat(start_latitude as string),
      parseFloat(start_longitude as string),
      parseFloat(end_latitude as string),
      parseFloat(end_longitude as string)
    );
    
    res.json(mockData);
  }
};

// Get Uber time estimates
export const getUberTimeEstimates: RequestHandler = async (req, res) => {
  try {
    const { start_latitude, start_longitude } = req.query;

    if (!start_latitude || !start_longitude) {
      return res.status(400).json({ error: 'Missing required coordinates' });
    }

    console.log('⏰ Fetching Uber time estimates for:', { start_latitude, start_longitude });

    // For demo purposes, always use mock data to ensure reliability
    console.log('🎭 Using mock time estimates for demo reliability');

    const mockData = generateMockTimeEstimates();
    console.log('✅ Mock time estimates generated:', mockData);
    res.json(mockData);

    // Comment out real API call for demo
    /*
    const response = await fetch(
      `https://api.uber.com/v1/estimates/time?start_latitude=${start_latitude}&start_longitude=${start_longitude}`,
      {
        headers: {
          'Authorization': `Token ${UBER_SERVER_TOKEN}`,
          'Accept-Language': 'en_US',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Uber time estimates API error:', response.status, errorText);

      // Return mock data if API fails
      const mockData = generateMockTimeEstimates();
      return res.json(mockData);
    }

    const data = await response.json();
    console.log('✅ Uber time estimates received:', data);
    res.json(data);
    */

  } catch (error) {
    console.error('❌ Error fetching Uber time estimates:', error);
    
    // Return mock data on error
    const mockData = generateMockTimeEstimates();
    res.json(mockData);
  }
};

// Book Uber ride
export const bookUberRide: RequestHandler = async (req, res) => {
  try {
    const { product_id, start_latitude, start_longitude, end_latitude, end_longitude } = req.body;

    if (!product_id || !start_latitude || !start_longitude || !end_latitude || !end_longitude) {
      return res.status(400).json({ error: 'Missing required booking parameters' });
    }

    console.log('📱 Attempting to book Uber ride:', { product_id, start_latitude, start_longitude, end_latitude, end_longitude });

    // For demo purposes, always simulate successful booking
    console.log('🎭 Simulating successful booking for demo');

    const mockBooking = {
      request_id: `demo_${Date.now()}`,
      status: 'confirmed',
      vehicle: {
        make: 'Toyota',
        model: 'Camry',
        license_plate: 'KA 05 AB 1234',
        picture_url: null
      },
      driver: {
        name: 'Rajesh Kumar',
        phone_number: '+91-9876543210',
        rating: 4.8,
        picture_url: null
      },
      location: {
        latitude: start_latitude,
        longitude: start_longitude,
        bearing: 90
      },
      eta: Math.floor(Math.random() * 8) + 3, // 3-10 minutes
      surge_multiplier: 1.0,
      shared: false,
      product_id: product_id,
      destination: {
        latitude: end_latitude,
        longitude: end_longitude
      },
      pickup: {
        latitude: start_latitude,
        longitude: start_longitude
      }
    };

    console.log('✅ Mock booking created successfully:', mockBooking);
    res.json(mockBooking);

    // Comment out real API call for demo
    /*
    const response = await fetch('https://api.uber.com/v1.2/requests', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${UBER_SERVER_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id,
        start_latitude,
        start_longitude,
        end_latitude,
        end_longitude,
        fare_id: null,
        surge_confirmation_id: null
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Uber booking API error:', response.status, errorData);

      // For demo purposes, simulate a successful booking even if API fails
      const mockBooking = {
        request_id: `mock_${Date.now()}`,
        status: 'processing',
        vehicle: null,
        driver: null,
        location: null,
        eta: 5,
        surge_multiplier: 1.0,
        shared: false,
        product_id: product_id,
        destination: {
          latitude: end_latitude,
          longitude: end_longitude
        },
        pickup: {
          latitude: start_latitude,
          longitude: start_longitude
        }
      };

      return res.json(mockBooking);
    }

    const data = await response.json();
    console.log('✅ Uber ride booked successfully:', data);
    res.json(data);
    */

  } catch (error) {
    console.error('❌ Error booking Uber ride:', error);
    
    // Return mock successful booking on error
    const mockBooking = {
      request_id: `mock_${Date.now()}`,
      status: 'processing',
      vehicle: null,
      driver: null,
      location: null,
      eta: 5,
      surge_multiplier: 1.0,
      shared: false,
      product_id: req.body.product_id,
      destination: {
        latitude: req.body.end_latitude,
        longitude: req.body.end_longitude
      },
      pickup: {
        latitude: req.body.start_latitude,
        longitude: req.body.start_longitude
      }
    };
    
    res.json(mockBooking);
  }
};

// Generate mock price estimates
function generateMockPriceEstimates(startLat: number, startLng: number, endLat: number, endLng: number) {
  const distance = calculateDistance(startLat, startLng, endLat, endLng);
  const baseTime = Math.max(5, Math.round(distance * 3));
  
  return {
    prices: [
      {
        product_id: 'uber-x-mock',
        currency_code: 'INR',
        display_name: 'UberX',
        estimate: `₹${Math.round(distance * 12 + 50)}-${Math.round(distance * 15 + 70)}`,
        low_estimate: Math.round(distance * 12 + 50),
        high_estimate: Math.round(distance * 15 + 70),
        surge_multiplier: 1.0,
        minimum: 50,
        duration: baseTime * 60
      },
      {
        product_id: 'uber-premier-mock',
        currency_code: 'INR',
        display_name: 'Premier',
        estimate: `₹${Math.round(distance * 18 + 80)}-${Math.round(distance * 22 + 120)}`,
        low_estimate: Math.round(distance * 18 + 80),
        high_estimate: Math.round(distance * 22 + 120),
        surge_multiplier: 1.0,
        minimum: 80,
        duration: (baseTime - 2) * 60
      },
      {
        product_id: 'uber-auto-mock',
        currency_code: 'INR',
        display_name: 'Auto',
        estimate: `₹${Math.round(distance * 8 + 30)}-${Math.round(distance * 10 + 50)}`,
        low_estimate: Math.round(distance * 8 + 30),
        high_estimate: Math.round(distance * 10 + 50),
        surge_multiplier: 1.0,
        minimum: 30,
        duration: (baseTime + 3) * 60
      }
    ]
  };
}

// Generate mock time estimates
function generateMockTimeEstimates() {
  return {
    times: [
      {
        product_id: 'uber-x-mock',
        estimate: 300 // 5 minutes in seconds
      },
      {
        product_id: 'uber-premier-mock',
        estimate: 180 // 3 minutes in seconds
      },
      {
        product_id: 'uber-auto-mock',
        estimate: 480 // 8 minutes in seconds
      }
    ]
  };
}

// Calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
