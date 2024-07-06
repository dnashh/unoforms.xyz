<script>
    import { FormStore, getAllForms } from "$lib/stores/form.js";
    import AddForm from "$lib/components/addForm.svelte";
    import FormItem from "$lib/components/FormItem.svelte";

    let forms;

    const fetchData = async () => {
        forms = await getAllForms();
        FormStore.set(forms);
    }

    if($FormStore.length){
        forms = $FormStore;
    } else {
        fetchData();
    }
    
</script>

<svelte:head>
    <title>UnoForms.xyz - Dashboard</title>
</svelte:head>

<div class="container max-w-screen-xl mx-auto flex flex-col gap-3 pt-2">
    <div class="flex justify-between">
        <h2 class="text-3xl font-bold m-2 px-5">All Forms</h2>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <label for="addForm" class="btn mr-2" modal-target="addFormModal">Add New</label>
    </div>
    <hr>
{#if forms}
    {#if forms?.length}
        {#each forms as form}
        <a href={`/forms/${form.id}/`} class="hover:shadow group">
            <FormItem {form} />
        </a>
        {/each}
    {:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="text-center my-20 font-semibold mx-auto">There are no forms here. <span class="text-red-600 hover:underline">Create a New Form</span> or Ask someone to share a form with you</p>
    {/if}
{:else}
        <FormItem />
        <FormItem />
        <FormItem />
        <FormItem />
        <FormItem />
{/if}

    
</div>
<AddForm />
