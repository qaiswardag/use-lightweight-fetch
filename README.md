Lightweight asynchronous data fetching hook for Vue 3. You can use this Hook for all request methods like GET, POST, PUT, DELETE, etc.

### New feature, access validation data properties like form input errors or old input values.

## Quick Features

- Data fetching (REST, promises).
- Method to handle data, access fetched data, isError, isLoading, isSuccess and validation properties.
- Is build for user experience in mind by being fast and high level of error handling.
- Never let your users miss any backend error(s). Catch all backend error(s) from frameworks like Laravel, Flask, Express, Django and many more into one single string.
- Can be used for all methods like GET, POST, PUT, DELETE, etc.
- Access validation data properties like form input errors or old input values.
- Fetched data is automatically served as JavaScript object.
- Add Custom fetch options like additionalCallTime or abortTimeoutTime.
- Takes advantage of Vue reactivity.
- Can work with TanStack Query.

## Features Vue 3

```js
  handleData,
  fetchedData,
  isError, // for flash messages like error, warning or success
  validationProperties, // for form input errors, old input values or nested messages
  isLoading,
  isSuccess,
```

## Code example Vue 3 for POST request

```js
import { vueFetch } from 'use-lightweight-fetch';

// use vue fetch
const {
  handleData,
  fetchedData,
  isError,
  validationProperties,
  isLoading,
  isSuccess,
} = vueFetch();

const submitPost = function () {
  handleData(
    '/posts', // url
    {
      method: 'POST', // GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
    // custom options
    {
      additionalCallTime: 300,
      abortTimeoutTime: 8000,
    }
  );
};
```

## Code example Vue 3 for GET request

```js
import { vueFetch } from 'use-lightweight-fetch';

const pathPosts = 'https://jsonplaceholder.typicode.com/posts';

// use vue fetch
const {
  handleData,
  fetchedData,
  isError,
  validationProperties,
  isLoading,
  isSuccess,
} = vueFetch();

onMounted(() => {
  handleData(
    pathPosts,
    {
      method: 'GET', // default method
    },
    // custom options
    {
      additionalCallTime: 300,
      abortTimeoutTime: 8000,
    }
  );
});
```
