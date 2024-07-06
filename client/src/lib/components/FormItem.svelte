<script>
    import { formatTimeAgo } from "$lib/utils/formatTimeAgo";
    export let form;
</script>
<div class="rounded-lg overflow-hidden mx-2 lg:m-0">
        {#if form}
            <div class="p-4">
              <h1 class="text-3xl font-bold mb-2 flex items-center">
                  <span class="mr-2">{form.title}</span>
                  {#if form.isPublic }
                    <span class="bg-green-200 p-1 text-sm text-green-700 rounded-md">Open</span>
                  {:else}
                    <span class="bg-red-200 p-1 text-sm text-red-700 rounded-md">Closed</span>
                  {/if}
                </h1>
            <div class="text-gray-500 text-sm">
              <div class="tooltip tooltip-right" data-tip={new Date(form.createdAt).toLocaleString()}>
                <p>Created {formatTimeAgo(form.createdAt)}</p>
              </div>
              <br>
              <div class="tooltip tooltip-right" data-tip={new Date(form.updatedAt).toLocaleString()}>
                <p>Updated {formatTimeAgo(form.updatedAt)}</p>
              </div>
            </div>
          </div>
        {:else}
            <div class="p-4">
              <h1 class="text-3xl font-bold mb-2 flex items-center">
                  <span class="skeleton skeleton-text"></span>
                    <span class="bg-gray-500 p-1 text-sm rounded-md"></span>
                </h1>
            <div class="text-gray-500 text-sm">
              <p class="skeleton skeleton-text"></p>
              <p class="skeleton skeleton-text"></p>
            </div>
          </div>
        {/if}
        
  </div>
  
  