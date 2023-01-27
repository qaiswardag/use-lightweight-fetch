Lightweight asynchronous data fetching hook for Vue 3. You can use this Hook for CRUD. GET, POST, PUT, DELETE, etc.

## Quick Features

- Data fetching (REST, promises)
- Method to handle data,
  access to fetched data,
  isError,
  isLoading,
  isSuccess
- Can be used for method like GET, POST, PUT, DELETE, etc.
- Never miss any backend error. Is built to catch all backend errors from frameworks like Laravel, Flask, Express, Django and many more
- Add Custom fetch options like additionalCallTime or abortTimeoutTime
- Can work with TanStack Query

## Code example Vue 3

```js
import { vueFetch } from 'use-lightweight-fetch';

const pathUsers = 'https://jsonplaceholder.typicode.com/users';

// use vue fetch
const { handleData, fetchedData, isError, isLoading, isSuccess } = vueFetch();

onMounted(async () => {
  try {
    await handleData(
      pathUsers,
      {},
      {
        additionalCallTime: 300,
        abortTimeoutTime: 8000,
      }
    );

    // catch
  } catch (err) {
    // catch any kind of backend error(s)
    isError.value = `${err}. ${isError.value ? isError.value : ''}`;
    //
  }
});
```
