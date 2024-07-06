<script>
    import { createForm } from "$lib/stores/form";
    
    let err = false;
    
    const formAction = (e) => {
        const formData = new FormData(e.target);
        const data = {}
        for (const key of formData.keys()){
            data[key] = formData.get(key)
        }
        createForm(data, modalClose);
    }

    const modalClose = ({ error }) => {
        if(error){
            err = true;
        } else {
            document.querySelector('#addForm').checked = false;
        }
    }
</script>

<input type="checkbox" id="addForm" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative outline">
    <label for="addForm" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <form class="flex flex-col gap-4" on:submit|preventDefault={formAction}>
        <h1 class="text-xl font-bold text-center">Create a New Form</h1>
        <input type="text" name="title" id="title" class="input input-primary w-full" placeholder="Title of your Form" required />
        <p>By Default Forms are Private. You can change visibility in the settings later.</p>
        {#if err}
            <p class="text-red-500">Some Error Occured, Try Again. Or if the problem persists, contact support.</p>
        {/if}
        <button class="btn" type="submit">Create New Form</button>
    </form>
  </div>
</div>