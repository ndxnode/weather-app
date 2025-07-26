"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className, children }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-white/10 backdrop-blur-sm",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </div>
  );
}

export function WeatherCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="space-y-6">
          {/* Temperature skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-24 w-32" />
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
          
          {/* Weather description */}
          <Skeleton className="h-6 w-3/4" />
          
          {/* Weather details grid */}
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ForecastCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full"
    >
      <div className="backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl p-6 border border-white/20">
        <Skeleton className="h-8 w-48 mb-6" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
              <Skeleton className="h-5 w-20 mb-3" />
              <Skeleton className="h-12 w-12 rounded-full mx-auto mb-3" />
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function InitialLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">Weather</h1>
          <Skeleton className="h-6 w-48 mx-auto" />
        </motion.div>

        <div className="flex flex-col items-center space-y-8">
          {/* Search bar skeleton */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm sm:max-w-md mx-auto"
          >
            <Skeleton className="h-12 w-full" />
            
            {/* Popular cities skeleton */}
            <div className="mt-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Weather cards */}
          <div className="w-full space-y-8">
            <WeatherCardSkeleton />
            <ForecastCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}