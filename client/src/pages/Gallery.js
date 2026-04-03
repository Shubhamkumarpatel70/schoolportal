import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { FiImage, FiSearch, FiX } from 'react-icons/fi';

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeImage, setActiveImage] = useState(null);

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

  const filteredImages = galleryImages.filter((image) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return (
      image.galleryName?.toLowerCase().includes(query)
      || image.title?.toLowerCase().includes(query)
      || image.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="ui-shell">
      <Header />

      <div className="flex-grow">
        <section className="ui-hero">
          <div className="ui-container relative text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">Campus Gallery</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/90 sm:text-lg">
              A quick look at classrooms, events, and student life moments.
            </p>
          </div>
        </section>

        <section className="ui-section">
          <div className="ui-container">
            <div className="ui-card mb-6 p-5 sm:p-6">
              <div className="relative md:max-w-sm">
                <FiSearch className="pointer-events-none absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ui-input pl-10"
                  placeholder="Search gallery..."
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-secondary" />
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="ui-card p-12 text-center">
                <p className="text-base text-slate-600">No gallery images match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredImages.map((image) => (
                  <button
                    key={image._id}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="aspect-video overflow-hidden bg-gradient-to-br from-secondary to-primary">
                      {image.image ? (
                        <img
                          src={image.image}
                          alt={image.title || image.galleryName}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FiImage className="text-6xl text-white/60 transition group-hover:text-white/80" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-left text-lg font-semibold text-slate-900">{image.galleryName}</h3>
                      {image.title && <p className="mt-1 text-sm text-slate-600">{image.title}</p>}
                      {image.description && <p className="mt-2 text-xs leading-6 text-slate-500">{image.description}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {activeImage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 px-4 py-10">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-slate-900">
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
              aria-label="Close image preview"
            >
              <FiX />
            </button>
            <div className="max-h-[70vh] overflow-hidden bg-slate-800">
              {activeImage.image ? (
                <img
                  src={activeImage.image}
                  alt={activeImage.title || activeImage.galleryName}
                  className="max-h-[70vh] w-full object-contain"
                />
              ) : (
                <div className="flex h-72 items-center justify-center">
                  <FiImage className="text-7xl text-white/50" />
                </div>
              )}
            </div>
            <div className="space-y-2 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-900">{activeImage.galleryName}</h3>
              {activeImage.title && <p className="text-sm font-medium text-slate-600">{activeImage.title}</p>}
              {activeImage.description && <p className="text-sm leading-6 text-slate-600">{activeImage.description}</p>}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;

