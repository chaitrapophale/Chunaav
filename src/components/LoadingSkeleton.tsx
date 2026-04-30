export const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
    </div>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
  </div>
);
