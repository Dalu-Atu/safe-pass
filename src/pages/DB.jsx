// import React, { useState } from "react";
// import { exportDatabase, importDatabase } from "../services/userService";

// const DatabaseManager = () => {
//   const [message, setMessage] = useState("");
//   const [isError, setIsError] = useState(false);

//   const handleExport = async () => {
//     try {
//       const result = exportDatabase();

//       setIsError(!result.success);
//       setMessage(
//         result.success ? "Data exported successfully!" : result.message
//       );

//       setTimeout(() => setMessage(""), 3000);
//     } catch (error) {
//       setIsError(true);
//       setMessage(`Error exporting data: ${error.message}`);
//     }
//   };

//   const handleImport = async () => {
//     try {
//       const result = await importDatabase();

//       setIsError(!result.success);
//       setMessage(
//         result.success ? "Data imported successfully!" : result.message
//       );

//       setTimeout(() => setMessage(""), 3000);

//       // Refresh the page to load the new data
//       if (result.success) {
//         setTimeout(() => window.location.reload(), 1000);
//       }
//     } catch (error) {
//       setIsError(true);
//       setMessage(`Error importing data: ${error.message}`);
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-4">Database Management</h2>

//       <div className="space-y-3">
//         <button
//           onClick={handleExport}
//           className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
//         >
//           Export Database
//         </button>

//         <button
//           onClick={handleImport}
//           className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
//         >
//           Import Database
//         </button>
//       </div>

//       {message && (
//         <div
//           className={`mt-3 p-2 rounded text-sm ${
//             isError ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
//           }`}
//         >
//           {message}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DatabaseManager;
