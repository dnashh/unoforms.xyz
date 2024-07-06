<script>
  import { FormDataStore, deleteResponse } from "$lib/stores/form";
  import { PUBLIC_SERVER_BASE_URL } from "$env/static/public";

  let form = $FormDataStore;
  let detail = null;

  FormDataStore.subscribe((data) => {
    form = data;
  });

  // Sort Table Function
  let order = 1;
  const orderColumns = (event) => {
    const column = event.srcElement.innerText.toLowerCase();
    form.formData = form.formData.sort((a, b) => {
      const aValue = a[column]?.value;
      const bValue = b[column]?.value;

      if (aValue !== undefined && bValue !== undefined) {
        if (aValue > bValue) {
          return order * 1;
        }
        if (aValue < bValue) {
          return order * -1;
        }
        return 0;
      }

      if (aValue === undefined && bValue !== undefined) {
        return order * -1;
      }

      if (aValue !== undefined && bValue === undefined) {
        return order * 1;
      }

      return 0;
    });

    order = order * -1;
  };

  const toggleDetails = (row) => {
    detail = row;
  };
</script>

{#if form && form.formData.length}
  <main class="max-w-screen flex flex-col gap-3">
    <section class="flex flex-row gap-3 justify-between">
      <div>
        <h2 class="text-2xl font-bold">Submissions</h2>
      </div>
      <div class="flex-row gap-2">
        <a
          href={`${PUBLIC_SERVER_BASE_URL}/forms/${form.id}?download=true`}
          class="btn btn-sm flex flex-row gap-2"
          download
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="#ffffff"
            viewBox="0 0 256 256"
            ><path
              d="M82.34,117.66A8,8,0,0,1,88,104h32V40a8,8,0,0,1,16,0v64h32a8,8,0,0,1,5.66,13.66l-40,40a8,8,0,0,1-11.32,0ZM216,144a8,8,0,0,0-8,8v56H48V152a8,8,0,0,0-16,0v56a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V152A8,8,0,0,0,216,144Z"
            /></svg
          >
          CSV</a
        >
      </div>
    </section>
    <div class="overflow-x-auto">
      <table class="table-auto w-full">
        <thead class="bg-black text-white">
          <tr class="text-sm uppercase">
            {#each Array.from(form.columns) as column}
              <th
                class="py-2 px-4 text-left cursor-pointer"
                {column}
                on:click={orderColumns}
              >
                <div class="flex items-center">
                  <span>{column}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3 h-3 ml-1 pointer-events-none"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 320 512"
                  >
                    <path
                      d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z"
                    />
                  </svg>
                </div>
              </th>
            {/each}
          </tr>
        </thead>
        <tbody class="text-sm divide-y">
          {#each form.formData as data}
            <tr class="hover:bg-gray-100">
              {#each Array.from(form.columns) as key}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <td on:click={() => toggleDetails(data)} class="py-2 px-4">
                  {#if key === "_time"}
                    {new Date(data[key].value).toLocaleString()}
                  {:else}
                    {data[key] ? data[key].value : ""}
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </main>
{:else}
  <p class="font-semibold text-center">No Submissions yet.</p>
{/if}

<!-- Sidebar Drawer -->
{#if detail}
  <div
    class="fixed top-0 left-0 w-screen h-screen flex flex-col lg:flex-row overflow-hidden"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => toggleDetails(null)}
      class="lg:w-3/4 bg-black bg-opacity-70 py-20"
    />
    <div
      class="bg-white h-screen w-screen lg:w-1/4 p-5 top-0 right-0 rounded-3xl overflow-y-auto"
    >
      <input
        id="response-detail"
        type="checkbox"
        class="drawer-toggle hidden"
      />
      <div class="h-full w-full flex flex-col">
        <h2 class="font-bold text-2xl mb-4">Response Detail</h2>
        <div class="flex flex-col gap-3">
          {#each Object.keys(detail) as key}
            {#if key == "#"}
              <div class="flex gap-1">
                <p class="font-bold">{key.toLocaleUpperCase()}</p>
                <p>{detail[key].value}</p>
              </div>
            {:else if key == "_details"}
              <div class="flex flex-col">
                <p>
                  Created {new Date(
                    detail["_details"].createdAt
                  ).toLocaleString()}
                </p>
                <p>
                  Updated {new Date(
                    detail["_details"].updatedAt
                  ).toLocaleString()}
                </p>
              </div>
            {:else}
              <div class="flex flex-col">
                <p class="font-bold">{key.toLocaleUpperCase()}</p>
                <p>{detail[key].value}</p>
              </div>
            {/if}
          {/each}
          <button
            class="btn btn-error btn-outline max-w-sm my-5 relative bottom-3"
            on:click={() => deleteResponse(detail["_details"].id)}
            >Delete Row</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
