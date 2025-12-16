import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { FiImage } from 'react-icons/fi';

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/gallery`);
      setGalleryImages(res.data);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
            <p className="text-xl text-white/90">
              Explore our campus and events
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 bg-neutral-1">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-3/70 text-lg">No gallery images available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image) => (
                  <div
                    key={image._id}
                    className="bg-neutral-2 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group"
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-secondary to-primary flex items-center justify-center overflow-hidden">
                      {image.image ? (
                        <img src={image.image} alt={image.title || image.galleryName} className="w-full h-full object-cover" />
                      ) : (
                        <FiImage className="text-6xl text-white opacity-50 group-hover:opacity-75 transition" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 text-neutral-3">{image.galleryName}</h3>
                      {image.title && <p className="text-sm text-neutral-3/70 mb-1">{image.title}</p>}
                      {image.description && <p className="text-xs text-neutral-3/50">{image.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Gallery;

