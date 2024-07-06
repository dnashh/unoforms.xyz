<script>
    import Aside from "$lib/components/aside.svelte";
    import FormItem from "$lib/components/FormItem.svelte";
    import { page } from "$app/stores";
    import { getFormDataByID, updateFormStore, FormStore, FormDataStore } from "$lib/stores/form";

    const id = $page.params.id
    let form = $FormStore.find(f => f.id == id);
    const fetchData = async () => {
        if(!form?.formData){
            form = await getFormDataByID(id);
            updateFormStore(id, form);
        }
        FormDataStore.set(form);
    }
    

    fetchData();

    FormDataStore.subscribe((data) => { form = data; });

</script>

<svelte:head>
    <title>{form?.title} - UnoForms.xyz</title>
</svelte:head>

{#if form.id == id}
    <main class="flex">
        <Aside />
        <section class="w-full mx-auto flex flex-col gap-3 overflow-auto border-l">
            <FormItem form={form} />
            <div class="p-4">
                <slot />
            </div>
        </section>
    </main>
{:else}
    Loading...
{/if}

