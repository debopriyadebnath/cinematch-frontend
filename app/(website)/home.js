"use client";

import Link from "next/link";
import Container from "@/components/container";
import MovieCard from "@/components/moviecard";
import React, { useEffect, useState } from "react";

export default function Post() {
  const [movieDetails, setMovieDetails] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("all");

  const genres = [
    "all", "action", "adventure", "comedy", "drama", 
    "horror", "romance", "sci-fi", "thriller"
  ];

  // Featured movie data
  const featuredMovie = {
    title: "Latest Movies",
    description: "Discover the perfect movie for your mood. Search from thousands of titles and get personalized recommendations.",
    image: "https://source.unsplash.com/random/1920x1080/?movie,cinema"
  };

  // Fetch trending movies
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const trendingTitles = [
          "The Dark Knight",
          "Inception",
          "Pulp Fiction",
          "The Matrix",
          "Interstellar",
          "The Godfather",
          "Fight Club",
          "Goodfellas"
        ];

        const moviePromises = trendingTitles.map(title =>
          fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=57408735`)
            .then(res => res.json())
        );

        const results = await Promise.all(moviePromises);
        setTrendingMovies(results.filter(movie => movie.Response === "True"));
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };

    fetchTrendingMovies();
  }, []);

  const fetchSearchResults = async () => {
    if (!searchVal.trim()) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://127.0.0.1:5000/recommend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ movie_name: searchVal })
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      const movieDetailsPromises = data.recommendations.map(movie =>
        fetch(
          `http://www.omdbapi.com/?t=${encodeURIComponent(movie)}&apikey=57408735`
        ).then(res => {
          if (!res.ok) throw new Error("Failed to fetch from OMDB");
          return res.json();
        })
      );

      const moviesDetails = await Promise.all(movieDetailsPromises);
      setMovieDetails(moviesDetails);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter movies by genre
  const filterMoviesByGenre = (movies) => {
    if (selectedGenre === "all") return movies;
    return movies.filter(movie => 
      movie.Genre && movie.Genre.toLowerCase().includes(selectedGenre.toLowerCase())
    );
  };

  // Handle enter key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        fetchSearchResults();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchVal]);

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={featuredMovie.image} 
            alt="Featured Movie" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <Container>
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="mb-4 text-5xl font-bold">{featuredMovie.title}</h1>
            <p className="mb-8 max-w-2xl text-lg">{featuredMovie.description}</p>
            
            {/* Search Bar */}
            <div className="relative flex w-full max-w-2xl items-center overflow-hidden rounded-lg bg-white">
              <div className="grid h-12 w-12 place-items-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                className="h-12 w-full pr-2 text-gray-700 outline-none"
                type="text"
                id="search"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search for movies..."
              />
              <button
                onClick={fetchSearchResults}
                className="h-12 bg-blue-600 px-6 text-white transition-colors hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {/* Trending Movies Section */}
        {trendingMovies.length > 0 && !movieDetails.length && (
          <div className="my-12">
            <h2 className="mb-6 text-2xl font-bold dark:text-white">Trending Movies</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {trendingMovies.map((movie, index) => (
                <MovieCard 
                  key={index} 
                  movie={movie} 
                  aspect="portrait" 
                  minimal={false}
                  fontSize="large"
                />
              ))}
            </div>
          </div>
        )}

        {/* Genre Filter */}
        {(movieDetails.length > 0 || trendingMovies.length > 0) && (
          <div className="my-8 flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedGenre === genre
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mt-12 flex flex-row items-center justify-center">
            <lord-icon
              src="https://cdn.lordicon.com/ybaojceo.json"
              trigger="loop"
              delay="2000"
              style={{
                width: "40px",
                height: "40px"
              }}
            />
          </div>
        )}

        {/* Movie Grid */}
        {!isLoading && movieDetails.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-6 text-2xl font-bold dark:text-white">Recommended Movies</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filterMoviesByGenre(movieDetails).map((movie, index) => (
                <MovieCard 
                  key={index} 
                  movie={movie} 
                  aspect="portrait"
                  minimal={false}
                  fontSize="large"
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && movieDetails.length === 0 && !trendingMovies.length && (
          <div className="mt-10 flex flex-col items-center justify-center">
            <lord-icon
              src="https://cdn.lordicon.com/tfliqeqn.json"
              trigger="loop"
              style={{
                width: "100px",
                height: "100px"
              }}
            />
            <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
              Search for movies to get personalized recommendations
            </p>
          </div>
        )}
      </Container>
    </>
  );
}
