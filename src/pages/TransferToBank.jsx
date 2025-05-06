import { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  CreditCard,
  FileText,
  DollarSign,
} from "lucide-react";

export default function BankTransferPage() {
  // Form state - completely separate objects for each concern
  const [formValues, setFormValues] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingNumber: "",
    swiftCode: "",
    address: "",
    amount: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Simple input change handler - only updates values
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Validate a single field on blur
  function validateField(name, value) {
    let error = null;

    switch (name) {
      case "accountName":
        if (!value.trim()) error = "Account name is required";
        break;
      case "accountNumber":
        if (!value.trim()) {
          error = "Account number is required";
        } else if (!/^\d+$/.test(value)) {
          error = "Account number must contain only digits";
        }
        break;
      case "bankName":
        if (!value.trim()) error = "Bank name is required";
        break;
      case "routingNumber":
        if (!value.trim()) error = "Routing/Sort code is required";
        break;
      case "amount":
        if (!value.trim()) {
          error = "Amount is required";
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          error = "Please enter a valid amount";
        }
        break;
      default:
        // No validation for other fields
        break;
    }

    // Update errors state
    setFormErrors((prev) => {
      if (error) {
        return { ...prev, [name]: error };
      } else {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
    });

    return !error;
  }

  // Handle field blur events
  function handleBlur(e) {
    const { name, value } = e.target;
    validateField(name, value);
  }

  // Validate all fields at once
  function validateForm() {
    const newErrors = {};
    let isValid = true;

    // Validate each field
    Object.entries(formValues).forEach(([fieldName, fieldValue]) => {
      if (!validateField(fieldName, fieldValue)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Form submission handler
  function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
      setSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setSubmitting(false);
        setShowErrorToast(true);

        setTimeout(() => {
          setShowErrorToast(false);
        }, 5000);
      }, 3000);
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 py-3 border-b border-gray-700 sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center">
          <button
            onClick={() => window.history.back()}
            className="mr-3 p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Transfer to Bank</h1>
            <p className="text-sm md:text-base text-gray-300">
              Transfer funds directly to your bank account
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-gray-800 rounded-xl shadow-lg p-5 md:p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Name */}
              <div className="space-y-2">
                <label
                  htmlFor="accountName"
                  className="block text-sm font-medium text-gray-200"
                >
                  Account Holder Name
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="accountName"
                    id="accountName"
                    value={formValues.accountName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-800 border ${
                      formErrors.accountName
                        ? "border-red-500"
                        : "border-gray-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="e.g. John Smith"
                  />
                </div>
                {formErrors.accountName && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.accountName}
                  </p>
                )}
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <label
                  htmlFor="accountNumber"
                  className="block text-sm font-medium text-gray-200"
                >
                  Account Number
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="accountNumber"
                    id="accountNumber"
                    value={formValues.accountNumber}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-800 border ${
                      formErrors.accountNumber
                        ? "border-red-500"
                        : "border-gray-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="e.g. 123456789"
                  />
                </div>
                {formErrors.accountNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.accountNumber}
                  </p>
                )}
              </div>

              {/* Bank Name */}
              <div className="space-y-2">
                <label
                  htmlFor="bankName"
                  className="block text-sm font-medium text-gray-200"
                >
                  Bank Name
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="bankName"
                    id="bankName"
                    value={formValues.bankName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-800 border ${
                      formErrors.bankName ? "border-red-500" : "border-gray-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="e.g. Chase Bank"
                  />
                </div>
                {formErrors.bankName && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.bankName}
                  </p>
                )}
              </div>

              {/* Routing Number */}
              <div className="space-y-2">
                <label
                  htmlFor="routingNumber"
                  className="block text-sm font-medium text-gray-200"
                >
                  Routing/Sort Code
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="routingNumber"
                    id="routingNumber"
                    value={formValues.routingNumber}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-800 border ${
                      formErrors.routingNumber
                        ? "border-red-500"
                        : "border-gray-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="e.g. 072000326"
                  />
                </div>
                {formErrors.routingNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.routingNumber}
                  </p>
                )}
              </div>

              {/* Swift Code */}
              <div className="space-y-2">
                <label
                  htmlFor="swiftCode"
                  className="block text-sm font-medium text-gray-200"
                >
                  SWIFT/BIC Code (for international transfers)
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="swiftCode"
                    id="swiftCode"
                    value={formValues.swiftCode}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="block w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. CHASUS33"
                  />
                </div>
              </div>

              {/* Bank Address */}
              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-200"
                >
                  Bank Address
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="address"
                    id="address"
                    rows="3"
                    value={formValues.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="block w-full pl-10 pr-3 py-2 text-gray-100 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 270 Park Avenue, New York, NY 10017"
                  />
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-200"
                >
                  Amount to Transfer
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    value={formValues.amount}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-800 border ${
                      formErrors.amount ? "border-red-500" : "border-gray-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="e.g. 1000.00"
                  />
                </div>
                {formErrors.amount && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.amount}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-200"
                >
                  Description (Optional)
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="description"
                    id="description"
                    rows="3"
                    value={formValues.description}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 text-gray-100 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Investment withdrawal"
                  />
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="font-medium text-white flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-yellow-400" />
                Important Information
              </h3>
              <ul className="mt-2 text-sm text-gray-300 list-disc pl-5 space-y-1">
                <li>Transfers typically takes within 24 hours to process</li>
                <li>
                  A verification code may be sent to your registered email/phone
                </li>
                <li>
                  Ensure all bank details are accurate to avoid transfer delays
                </li>
                <li>International transfers may incur additional fees</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Processing...
                  </>
                ) : (
                  "Withdraw Funds"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error Toast */}
      {showErrorToast && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in-up">
          <AlertCircle className="h-6 w-6" />
          <div>
            <h3 className="font-medium">Something went wrong</h3>
            <p className="text-sm text-red-100">
              Please contact customer care for assistance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
