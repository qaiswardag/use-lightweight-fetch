import { ref } from 'vue';
import { usePromise } from '../helpers/use-promise';
import { isObject } from '../helpers/is-object';

export const vueFetch = function vueFetch() {
  // Initializing state management references
  const isSuccess = ref(false);
  const isLoading = ref(false);
  const isError = ref(false);
  const error = ref(null);
  const errors = ref(null);
  const goDirectToError = ref(false);
  const fetchedData = ref(null);

  // Initializing fetch operation control parameters
  const controller = new AbortController();
  const additionalTime = ref(null);
  const abortTimeout = ref(null);

  // Function to handle data fetching and state updates
  const handleData = async function (
    url,
    fetchOptions = {},
    customFetchOptions = {}
  ) {
    // Initialize or set timeout and additional time values
    abortTimeout.value = customFetchOptions.abortTimeoutTime;
    additionalTime.value = customFetchOptions.additionalCallTime;

    // Provide default values for abortTimeout and additionalTime
    if (additionalTime.value === undefined) additionalTime.value = 0;
    if (abortTimeout.value === undefined) abortTimeout.value = 12000;

    // Abort fetch operation after the specified timeout
    const timer = setTimeout(() => {
      controller.abort();
    }, abortTimeout.value);

    try {
      // Begin fetch operation
      isLoading.value = true;
      const promise = usePromise(additionalTime.value);
      await promise;

      // Check for abort signal and handle accordingly
      if (controller.signal.aborted) {
        clearTimeout(timer);
        isLoading.value = false;
        isError.value = false;
        goDirectToError.value = true;
        throw new Error(
          'Error 500. The loading time has been exceeded. Please refresh this page'
        );
      }

      // Fetch and handle response
      const response = await fetch(url, fetchOptions);

      // Check if the fetch request was successful. If not, throw an error
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`${response.status}. ${response.statusText}`);
      }

      // Parse JSON response when content-type is 'application/json'
      const contentType = response.headers.get('content-type');
      if (contentType.includes('application/json') === true) {
        clearTimeout(timer);
        isSuccess.value = true;
        isLoading.value = false;
        isError.value = false;
        fetchedData.value = await response.json();
        return fetchedData.value;
      }

      // Handle non-GET requests without 'application/json' content-type
      if (
        fetchOptions?.method !== 'GET' &&
        fetchOptions?.method !== 'get' &&
        fetchOptions?.method !== undefined
      ) {
        clearTimeout(timer);
        isSuccess.value = true;
        isLoading.value = false;
        isError.value = false;
        fetchedData.value = 'Your request was processed successfully.';
        return 'Your request was processed successfully.';
      }

      // Handle GET requests without 'application/json' content-type
      clearTimeout(timer);
      isSuccess.value = true;
      isLoading.value = false;
      isError.value = false;
      goDirectToError.value = true;
      throw new Error('Error 500. No application/json in the request header');
    } catch (err) {
      clearTimeout(timer);
      isSuccess.value = false;
      isLoading.value = false;

      // Set default error message
      isError.value = true;
      error.value = `Not able to fetch data. Error status: ${err}.`;

      // Fetch response for error handling
      const response = await fetch(url, fetchOptions);

      // Get content type of the response
      const contentType = response.headers.get('content-type');

      // Handle errors when content type is 'application/json'
      if (
        contentType.includes('application/json') === true &&
        goDirectToError.value !== true
      ) {
        // Parse the response body as JSON
        const collectingErrorsJson = await response.json();

        // Collect backend form validation errors
        errors.value = collectingErrorsJson;

        // Handle different types of error messages

        // If the error message is a string, handle it accordingly
        if (typeof collectingErrorsJson === 'string') {
          // Set error message when error body is a string
          isError.value = true;
          error.value = `Not able to fetch data. Error status: ${err.message}. ${collectingErrorsJson}`;
        }
        // If the error message is an array, handle it accordingly
        if (Array.isArray(collectingErrorsJson)) {
          // Set error message when error body is an array
          isError.value = true;
          error.value = `Not able to fetch data. Error status: ${
            err.message
          }. ${collectingErrorsJson.join(' ')}`;
        }
        // If the error message is an object, handle it accordingly
        if (isObject(collectingErrorsJson)) {
          const errorsKeys = Object.keys(collectingErrorsJson);
          const errorsValues = Object.values(collectingErrorsJson);

          // If there are no errors, handle it accordingly
          if (errorsKeys.length === 0) {
            // Set error message when error body is an empty object
            isError.value = true;
            error.value = `Not able to fetch data. Error status: ${response.status}.`;
          }

          // If there are errors, handle them accordingly
          if (errorsKeys.length > 0) {
            for (let i = 0; i < errorsKeys.length; i++) {
              if (Array.isArray(errorsValues[i]) || isObject(errorsValues[i])) {
                // Set error message when encountering a nested object or array
                isError.value = true;
                error.value = `Not able to fetch data. Error status: ${err.message}`;
                break;
              }

              // If the error is neither an array nor an object, handle it accordingly
              if (
                !Array.isArray(errorsValues[i]) &&
                !isObject(errorsValues[i])
              ) {
                const errorObjToString =
                  Object.values(collectingErrorsJson).join(' ');
                // Set error message when error body is a flat object
                isError.value = true;
                error.value = `Not able to fetch data. Error status: ${err.message}. ${errorObjToString}`;
              }
            }
          }
        }
      }

      // If the response's Content-Type is not application/json, handle it accordingly
      if (
        contentType.includes('application/json') === false ||
        goDirectToError.value === true
      ) {
        isError.value = true;
        error.value = `Not able to fetch data. Error status: ${err.message}`;
      }

      // Rethrow the error for further handling
      throw err;
    }
  };

  // Return the state variables and the fetch function
  return {
    isSuccess,
    isLoading,
    isError,
    error,
    errors,
    handleData,
    fetchedData,
  };
};
