import { ref } from 'vue';
import { usePromise } from '../helpers/use-promise';
import { isObject } from '../helpers/is-object';
export const vueFetch = function vueFetch() {
  // is success, is loading, is error, fetched data
  const isSuccess = ref(false);
  const isLoading = ref(false);
  const isError = ref(false);
  const goDirectToError = ref(false);
  const validationProperties = ref(null);
  const fetchedData = ref(null);
  // controller, additional time, abort time out
  const controller = new AbortController();
  const additionalTime = ref(null);
  const abortTimeout = ref(null);

  // handle data
  const handleData = async function (
    url,
    fetchOptions = {},
    customFetchOptions = {
      additionalCallTime,
      abortTimeoutTime,
    }
  ) {
    // set variables
    abortTimeout.value = customFetchOptions.abortTimeoutTime;
    additionalTime.value = customFetchOptions.additionalCallTime;

    // set response timeout to 0 if not set
    if (additionalTime.value === undefined) {
      additionalTime.value = 0;
    }
    // set about timeout time to 12000 if not set
    if (abortTimeout.value === undefined) {
      abortTimeout.value = 12000;
    }

    // timer
    const timer = setTimeout(() => {
      controller.abort();
    }, abortTimeout.value);

    try {
      // loading
      isLoading.value = true;
      // promise
      const promise = usePromise(additionalTime.value);
      // wait for additional response time. additional time is set when calling the function
      await promise;

      // if loading time gets exceeded
      if (controller.signal.aborted) {
        clearTimeout(timer);
        isLoading.value = false;
        isError.value = null;

        // jump directly to the end of catch
        goDirectToError.value = true;
        // throw new error
        throw new Error(
          'Error 500. The loading time has been exceeded. Please refresh this page'
        );
      }

      // response
      const response = await fetch(url, fetchOptions);
      // handle errors
      if (response.status !== 200 && response.status !== 201) {
        // throw new error with returned error messages
        throw new Error(`${response.status}. ${response.statusText}`);
      }

      // set variable for content type
      const contentType = response.headers.get('content-type');

      // in request header check for application/json
      if (contentType.includes('application/json')) {
        fetchedData.value = await response.json();

        clearTimeout(timer);
        isSuccess.value = true;
        isLoading.value = false;
        isError.value = null;

        // return "fetched data"
        return fetchedData.value;
      }

      clearTimeout(timer);
      isSuccess.value = true;
      isLoading.value = false;
      isError.value = null;
      // "fetched data" is null at this moment

      // jump directly to the end of catch
      goDirectToError.value = true;
      // throw new error
      throw new Error('Error 500. No application/json in the request header');
    } catch (err) {
      clearTimeout(timer);
      isSuccess.value = false;
      isLoading.value = false;

      // response
      const response = await fetch(url, fetchOptions);

      // set variable for content type
      const contentType = response.headers.get('content-type');

      // check if request is application/json in the request header
      if (
        contentType.includes('application/json') &&
        goDirectToError.value !== true
      ) {
        // json
        const collectingErrorsJson = await response.json();

        // set backend form validation errors for requests POST, UPDATE etc.
        validationProperties.value = collectingErrorsJson;

        // check if fetched data is a string. If true insert all values into isError.value
        if (typeof collectingErrorsJson === 'string') {
          // set error
          isError.value = `${err.message}. ${collectingErrorsJson}`;
        }

        // check if fetched data is an array. If true insert all values into isError.value
        if (Array.isArray(collectingErrorsJson)) {
          isError.value = `${err.message}. ${collectingErrorsJson.join(' ')}`;
        }

        // check if fetched data is an object. If true insert all values into isError.value
        if (isObject(collectingErrorsJson)) {
          const errorsKeys = Object.keys(collectingErrorsJson);
          // access values of collectingErrorsJson for checking is it contains nested objects or array
          const errorsValues = Object.values(collectingErrorsJson);

          // check if "collecting errors json" is an empty object
          // if true return response status code
          if (errorsKeys.length === 0) {
            isError.value = `Error ${response.status}.`;
          }

          // check if "collecting errors json" contains nested objects
          // or arrays, "collecting errors json" is not gonna be included in isError
          // "form validation errors" can be used to instead to access nested objects or array properties
          if (errorsKeys.length > 0) {
            //
            for (let i = 0; i < errorsKeys.length; i++) {
              if (Array.isArray(errorsValues[i])) {
                // set "is error"
                isError.value = `${err.message}`;
                break;
              }
              if (isObject(errorsValues[i])) {
                // set "is error"
                isError.value = `${err.message}`;
                break;
              }
              //
              // if "collecting errors json" do not contains nested objects or arrays
              if (
                !Array.isArray(errorsValues[i]) &&
                !isObject(errorsValues[i])
              ) {
                const errorObjToString =
                  Object.values(collectingErrorsJson).join(' ');
                // set "is error"
                isError.value = `${err.message}. ${errorObjToString}`;
              }
            }
          }

          //
        }

        // end if content type is application/json
      }

      // check if request is application/json in the request header
      if (
        !contentType.includes('application/json') ||
        goDirectToError.value === true
      ) {
        isError.value = `${err.message}`;
      }

      // throw
      throw err;
    }
  };

  return {
    isSuccess,
    isLoading,
    isError,
    validationProperties,
    handleData,
    fetchedData,
  };
};
