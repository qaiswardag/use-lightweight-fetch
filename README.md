Lightweight asynchronous data fetching hook for Vue 3. You can use this Hook for all request methods like GET, POST, PUT, DELETE, etc.

## Quick Features

- Data fetching (REST, promises).
- Method to handle data, access fetched data, isError, isLoading, isSuccess.
- Takes advantage of Vue reactivity.
- Responses are automatically served as JavaScript object.
- Can be used for method like GET, POST, PUT, DELETE, etc.
- Never miss any backend error. Is built to catch all backend errors from frameworks like Laravel, Flask, Express, Django and many more.
- Add Custom fetch options like additionalCallTime or abortTimeoutTime.
- Can work with TanStack Query.

## Code example Vue 3 for POST request

```js
import { vueFetch } from 'use-lightweight-fetch';

// use vue fetch
const { handleData, fetchedData, isError, isLoading, isSuccess } = vueFetch();

const submitPost = async function () {
  try {
    await handleData(
      '/posts',
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

    // catch
  } catch (err) {
    // catch all types of backend error(s) on client side as a string for your app
    isError.value = `${err}. ${isError.value ? isError.value : ''}`;
    //
  }
};
```

## Code example Vue 3 for GET request

```js
import { vueFetch } from 'use-lightweight-fetch';

const pathUsers = 'https://jsonplaceholder.typicode.com/users';

// use vue fetch
const { handleData, fetchedData, isError, isLoading, isSuccess } = vueFetch();

onMounted(async () => {
  try {
    await handleData(
      pathUsers,
      {
        method: 'GET', // GET, POST, PUT, DELETE, etc.
      },
      // custom options
      {
        additionalCallTime: 300,
        abortTimeoutTime: 8000,
      }
    );

    // catch
  } catch (err) {
    // catch all types of backend error(s) on client side as a string for your app
    isError.value = `${err}. ${isError.value ? isError.value : ''}`;
    //
  }
});
```
