import Image from "next/image";
import Link from "next/link";
import { cx } from "@/utils/all";
import { StarIcon } from "@sanity/icons";
import { IconInnerShadowTopRight, IconThumbUp, IconClock, IconCalendar } from "@tabler/icons-react";
import { useState } from "react";

export default function MovieCard({
  movie,
  aspect,
  minimal,
  fontSize,
  fontWeight
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className={cx(
          "group cursor-pointer",
          minimal && "grid gap-10 md:grid-cols-2"
        )}
        onClick={() => setShowModal(true)}>
        <div
          className={cx(
            "relative overflow-hidden rounded-md bg-gray-100 transition-all hover:scale-105 dark:bg-gray-800"
          )}>
          <div
            className={cx(
              "relative block",
              aspect === "landscape"
                ? "aspect-video"
                : aspect === "custom"
                ? "aspect-[5/4]"
                : "aspect-square"
            )}>
            <Image
              src={movie?.Poster}
              alt={movie?.Title || "Movie Poster"}
              className="object-cover transition-all duration-300 group-hover:opacity-90"
              fill
              sizes="(max-width: 768px) 30vw, 33vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-40">
              <div className="flex h-full items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="rounded-full bg-white bg-opacity-80 px-4 py-2 text-sm font-medium text-black">
                  View Details
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={cx(minimal && "flex items-center")}>
          <div className="w-full">
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center space-x-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                <StarIcon className="h-4 w-4" />
                <span>{movie.imdbRating}</span>
              </div>

              <div className="flex items-center space-x-1 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 dark:bg-orange-900 dark:text-orange-200">
                <IconThumbUp size={16} />
                <span>{parseInt(movie.imdbVotes).toLocaleString()}</span>
              </div>

              <div className="flex items-center space-x-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <IconClock size={16} />
                <span>{movie.Runtime}</span>
              </div>
            </div>

            <h2
              className={cx(
                fontSize === "large" ? "text-2xl" : minimal ? "text-3xl" : "text-lg",
                fontWeight === "normal"
                  ? "line-clamp-2 font-medium tracking-normal text-black"
                  : "font-semibold leading-snug tracking-tight",
                "mt-2 dark:text-white"
              )}>
              <span className="bg-gradient-to-r from-blue-200 to-blue-100 bg-[length:0px_10px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_10px] dark:from-blue-800 dark:to-blue-900">
                {movie.Title}
              </span>
            </h2>

            <div className="mt-3 flex items-center space-x-3 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-3">
                <IconCalendar size={16} />
                <span className="text-sm">{movie.Year}</span>
              </div>
              <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
              <span className="text-sm">{movie.Language}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowModal(false)} />
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
                <Image
                  src={movie?.Poster}
                  alt={movie?.Title || "Movie Poster"}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div>
                <h2 className="text-3xl font-bold dark:text-white">{movie.Title}</h2>
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center space-x-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                      <StarIcon className="h-4 w-4" />
                      <span>{movie.imdbRating}</span>
                    </div>
                    <div className="flex items-center space-x-1 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 dark:bg-orange-900 dark:text-orange-200">
                      <IconThumbUp size={16} />
                      <span>{parseInt(movie.imdbVotes).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      <IconClock size={16} />
                      <span>{movie.Runtime}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300">{movie.Plot}</p>

                  <div className="space-y-2">
                    <p><span className="font-semibold">Director:</span> {movie.Director}</p>
                    <p><span className="font-semibold">Cast:</span> {movie.Actors}</p>
                    <p><span className="font-semibold">Genre:</span> {movie.Genre}</p>
                    <p><span className="font-semibold">Released:</span> {movie.Released}</p>
                    <p><span className="font-semibold">Language:</span> {movie.Language}</p>
                  </div>

                  {movie.Awards !== "N/A" && (
                    <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/30">
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Awards</h3>
                      <p className="mt-1 text-yellow-700 dark:text-yellow-300">{movie.Awards}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
