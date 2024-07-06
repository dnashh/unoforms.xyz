<script>
    import { page } from "$app/stores";
    let copyIcon = true
    const copyLink = () => {
        navigator.clipboard.writeText(document.querySelector('#public_url').value);
        copyIcon = false
    }
</script>

<main class="max-w-screen">
    <h2 class="text-2xl font-bold">Setup</h2>
    <section class="min-w-full flex flex-col gap-3 my-3">
        <p>Public Url for Submission</p>
        <div class="form-control">
            <label class="input-group">
              <span class="font-bold">POST</span>
              <input type="text" id="public_url" value={`${window.location.origin}/submit/${$page.params.id}`} class="input input-bordered w-full max-w-[600px] hover:cursor-text" disabled />
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <span on:click={copyLink} class="hover:cursor-pointer">
                {#if copyIcon}
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M216,28H88A12,12,0,0,0,76,40V76H40A12,12,0,0,0,28,88V216a12,12,0,0,0,12,12H168a12,12,0,0,0,12-12V180h36a12,12,0,0,0,12-12V40A12,12,0,0,0,216,28ZM156,204H52V100H156Zm48-48H180V88a12,12,0,0,0-12-12H100V52H204Z"></path></svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"></path></svg>
                {/if}
              </span>
            </label>    
        </div>
    </section>
    <section class="w-max">

    </section>
</main>