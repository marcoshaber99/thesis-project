import React from "react";

interface ToastProps {
  onAccept: () => void;
  onIgnore: () => void;
}

const AiToast: React.FC<ToastProps> = ({ onAccept, onIgnore }) => {
  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 transition-transform duration-300 ease-out">
      <div className="flex items-center justify-between space-x-4">
        <span className="text-gray-800 dark:text-gray-200">
          AI generated text added. Accept?
        </span>
        <div className="flex space-x-2">
          <button
            onClick={onIgnore}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-lg transition-colors duration-200"
          >
            Ignore
          </button>
          <button
            onClick={onAccept}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded-lg transition-colors duration-200"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiToast;
