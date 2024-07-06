<script>
    import { updateForm, FormDataStore } from "$lib/stores/form";
    
    let { id, isPublic, title, redirectTo, allowDuplicates, primaryKeys } = $FormDataStore;


    let data = '';
    const update = async () => {
        data = await updateForm(id, { isPublic, title, redirectTo, allowDuplicates: !allowDuplicates, primaryKeys: primaryKeys.toLowerCase().split(',') });
        FormDataStore.update((old) => {
            old.isPublic = data.form.isPublic;
            old.title = data.form.title;
            old.updatedAt = data.form.updatedAt;
            old.redirectTo = data.form.redirectTo;
            old.allowDuplicates = data.form.allowDuplicates;
            old.primaryKeys = data.form.primaryKeys;
            return old;
        });
        setTimeout(() => {data = ''}, 3000);
    }

    FormDataStore.subscribe((data) => {
        id = data.id
        title = data.title;
        isPublic = data.isPublic;
        redirectTo = data.redirectTo;
        allowDuplicates = !data.allowDuplicates;
        primaryKeys = data.primaryKeys.toString();
    });

</script>

<main class="max-w-screen flex flex-col gap-3 pb-12">
    <section class="flex flex-col gap-3 max-w-screen-md">
        <h2 class="text-2xl font-bold">Settings</h2>
        <form class="flex flex-col gap-3" on:submit|preventDefault={update}>
            <div class="form-control">
                <label for="isPublic" class="label cursor-pointer">
                    <div>
                        <span class="label-text text-lg font-semibold">Open for Submissions</span>
                        <p class="max-w-sm">Keep it Checked to accept incoming Responses from the Public</p>
                    </div>
                  <input type="checkbox" class="toggle" name="isPublic" id="isPublic" bind:checked={isPublic} />
                </label>
            </div>
            <div class="form-control">
                <label for="allowDuplicates" class="label cursor-pointer">
                    <div>
                        <span class="label-text text-lg font-semibold">Restrict Duplicates</span> 
                        <p class="max-w-sm">When turned on, duplicates will be removed based on Primary Key</p>
                    </div>
                <input type="checkbox" class="toggle" name="allowDuplicates" id="allowDuplicates" bind:checked={allowDuplicates} />
                </label>
            </div>
              <div class="form-control w-full flex md:flex-row justify-between">
                <label for="primaryKeys" class="label">
                    <div>
                        <span class="label-text text-lg font-semibold">Primary Keys</span>
                        <p class="max-w-sm">Define one or more primary keys (separated by comma) to restrict duplicate entries to form.
                            Disabled when Duplicates are not Restricted
                        </p>
                    </div>
                </label>
                <input type="text" placeholder="Handled by unoforms, when left blank" id="primaryKeys" name="primaryKeys" disabled={!allowDuplicates} bind:value={primaryKeys} class="input input-bordered w-full max-w-sm my-auto md:text-right" />
            </div>
              <div class="form-control w-full flex md:flex-row justify-between">
                <label for="redirectTo" class="label">
                    <div>
                        <span class="label-text text-lg font-semibold">Redirect Url</span>
                        <p class="max-w-sm">Setup a custom Redirect Url, that the user will see after form Submit. The Url Parameters are also sent.</p>
                    </div>
                </label>
                <input type="url" placeholder="Handled by unoforms, when left blank" id="redirectTo" name="redirectTo" bind:value={redirectTo} class="input input-bordered w-full max-w-sm my-auto md:text-right" />
            </div>
            <div class="form-control w-full flex md:flex-row justify-between">
                <label for="title" class="label">
                    <div>
                        <span class="label-text text-lg font-semibold">Rename Form</span>
                        <p class="max-w-sm">Change the title of the Form</p>
                    </div>
                </label>
                <input type="text" placeholder="Form Title" id="title" name="title" bind:value={title} class="input input-bordered w-full max-w-sm md:text-right my-auto" required />
            </div>

            <input type="submit" value="Update" class="btn bg-black cursor-pointer my-5 max-w-sm md:ml-auto">

            {#if data}
               <div class="toast">
                <div class="alert alert-success">
                    <div>
                        <span>{data.message}</span>
                    </div>
                </div>
               </div>
            {/if}
        </form>
    </section>
</main>