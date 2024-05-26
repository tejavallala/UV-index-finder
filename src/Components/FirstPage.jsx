import React, { useState, useEffect } from "react";
import axios from "axios";

const FirstPage = () => {
  const [locationName, setLocationName] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [bgColor, setBgColor] = useState('');

  useEffect(() => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    setBgColor(randomColor);
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          await getLocationName(latitude, longitude);
          await getUvIndex(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location", error);
          setError("Failed to get location");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  };

  const getLocationName = async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          q: `${latitude}+${longitude}`,
          key: '6bfa24d1e9e449f7988514387ccfb172' // Replace with your OpenCage API key
        }
      });
      setLocationName(response.data.results[0].formatted);
    } catch (error) {
      console.error("Failed to fetch location name", error);
      setError("Failed to fetch location name");
    } finally {
      setLoading(false);
    }
  };

  const getUvIndex = async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://api.openuv.io/api/v1/uv', {
        params: {
          lat: latitude,
          lng: longitude
        },
        headers: {
          'x-access-token': 'openuv-ekc75rlwlggph2-io' // Replace with your OpenUV API key
        }
      });
      setUvIndex(response.data.result.uv);
      setRecommendation(response.data.result.uv > 3 ? 'Use sunscreen' : 'No need for sunscreen');
    } catch (error) {
      console.error('Failed to fetch UV index', error);
      setError('Failed to fetch UV index');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div className="row justify-content-center align-items-center" style={{ flexGrow: 1 }}>
        <div className="col-md-6">
          <h2 className="text-center mb-4">Protect Your Skin from Harmful UV Rays</h2>
          <p className="text-center mb-4">Remember to apply sunscreen to protect your skin from the sun's harmful rays.</p>
          <div className="card bg-dark text-white">
            <div className="card-body text-center">
              <h5 className="card-title">UV Index Checker</h5>
              <button
                className="btn btn-primary mb-3"
                onClick={getCurrentLocation}
              >
                Get Location and UV Index
              </button>
              {locationName && (
                <div className="alert alert-info bg-light">
                  <strong>Location:</strong> {locationName}
                </div>
              )}
              {loading && <div className="alert alert-warning">Loading UV index...</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              {uvIndex !== null && (
                <div className="alert alert-info bg-light">
                  <strong>UV Index:</strong> {uvIndex}
                </div>
              )}
              {uvIndex !== null && (
                <div className={`alert ${uvIndex > 3 ? 'alert-danger' : 'alert-success'} bg-light`}>
                  {recommendation}
                </div>
              )}
              {recommendation === 'Use sunscreen' && (
                <div className="mt-3">
                  <h6>Shop Sunscreen Products:</h6>
                  <ul className="list-unstyled">
                    <li><a href="https://example.com/sunscreen-product-1" target="_blank" rel="noopener noreferrer"><i className="fas fa-sun"></i> Sunscreen Product 1</a></li>
                    <li><a href="https://example.com/sunscreen-product-2" target="_blank" rel="noopener noreferrer"><i className="fas fa-sun"></i> Sunscreen Product 2</a></li>
                    <li><a href="https://example.com/sunscreen-product-3" target="_blank" rel="noopener noreferrer"><i className="fas fa-sun"></i> Sunscreen Product 3</a></li>
                    {/* Add more sunscreen product links as needed */}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center mt-4 mb-4">
        Developed by <a href="https://github.com/tejavallala" target="_blank" rel="noopener noreferrer">~Teja</a>
      </footer>
    </div>
  );
};

export default FirstPage;
