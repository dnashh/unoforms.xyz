<script>
  import {
    FormDataStore,
    addAction,
    editAction,
    deleteAction,
  } from "$lib/stores/form";
  import actionRules from "$lib/utils/actionRules.js";
  const { id: form, actions } = $FormDataStore;

  var currentAction;
  var viewOnly = true;
  var curr;

  const toggleModal = (e) => {
    const dialog = document.querySelector("dialog");
    const actionID = e.target.dataset.actionId;
    viewOnly = e.target.dataset.viewonly;
    currentAction = Array.from(actionRules).find((item) => item.id == actionID);
    if (dialog.open && !currentAction) {
      dialog.close();
      currentAction = undefined;
    } else {
      if (viewOnly !== undefined) {
        const action = actions.find((item) => item.action == actionID);
        currentAction.variables = action?.variables;
        currentAction.action = action;
      }
      dialog.showModal();
    }
  };

  const submitAction = (e) => {
    const formData = new FormData(e.target);
    const type = e.target.querySelector(["[data-action-type]"]).dataset
      .actionType;
    const variables = {};
    formData.forEach((value, key) => {
      variables[key] = value;
    });
    const data = {
      action: type === "add" ? currentAction.id : currentAction.action.id,
      form,
      variables,
    };
    if (type === "edit") {
      editAction(data, form);
    } else {
      addAction(data, form);
    }
  };
</script>

<main class="max-w-screen flex flex-col gap-3">
  <section class="flex flex-col gap-3 max-w-screen-lg">
    <h2 class="text-2xl font-bold">Active Actions</h2>
    {#if actions.length}
      {#each actions as action}
        <p class="hidden">
          {(curr = actionRules.find((item) => item.id === action.action))}
        </p>
        <div class="border p-3 hover:shadow-lg rounded-lg flex flex-row gap-2">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="#000000"
              viewBox="0 0 256 256"><path d={curr.icon} /></svg
            >
          </div>
          <div>
            <h3 class="font-bold text-xl">
              {curr.name}
            </h3>
            <p class="mb-2">{curr.description}</p>
            {#if curr?.action?.variables?.trigger_type}
              <p class="bg-blue-300 rounded p-1 font-semibold w-fit">
                Trigger Type: {curr.action.variables.trigger_type}
              </p>
            {/if}
          </div>
          <div class="ml-auto flex flex-col justify-center">
            <button
              data-action-id={curr.id}
              data-viewOnly={true}
              on:click={toggleModal}
              class="bg-green-300 hover:bg-green-500 text-black rounded-lg max-w-md w-max p-3 my-auto btn"
              >View</button
            >
          </div>
        </div>
      {/each}
    {:else}
      <div
        class="text-center w-full h-[200px] bg-gray-200 rounded-xl flex flex-col justify-center"
      >
        <p class="font-bold text-xl max-w-md mx-auto">
          There are No Active Actions for this Form. Create Actions from Below
        </p>
      </div>
    {/if}
  </section>
  <hr />
  <section class="w-full max-w-screen h-max mb-20">
    <h2 class="text-2xl font-bold mb-4">All Actions</h2>
    <div class="flex flex-col gap-3 max-w-screen-lg">
      {#each actionRules as action}
        <div class="border p-3 hover:shadow-lg rounded-lg flex flex-row gap-2">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="#000000"
              viewBox="0 0 256 256"><path d={action.icon} /></svg
            >
          </div>
          <div>
            <h3 class="font-bold text-xl">{action.name}</h3>
            <p class="mb-2">{action.description}</p>
            <p class="bg-blue-300 rounded p-1 font-semibold w-fit">
              Trigger Types: {Array.from(action.trigger_type).join(" | ")}
            </p>
          </div>
          <div class="ml-auto flex flex-col justify-center">
            <button
              data-action-id={action.id}
              on:click={toggleModal}
              class="bg-green-300 hover:bg-green-500 text-black rounded-lg max-w-md w-max p-3 my-auto btn"
              >Add</button
            >
          </div>
        </div>
      {/each}
    </div>
  </section>
  <dialog
    class="bg-white w-screen max-w-screen-lg mx-auto h-fit md:min-h-1/2 my-auto absolute top-0 left-0 z-30 p-3 rounded-3xl"
  >
    {#if currentAction}
      <div class="p-3 rounded-lg flex flex-row gap-2">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="#000000"
            viewBox="0 0 256 256"><path d={currentAction.icon} /></svg
          >
        </div>
        <div>
          <h3 class="font-bold text-xl">{currentAction.name}</h3>
          <p class="mb-2">{currentAction.description}</p>
          <p class="bg-blue-300 rounded p-1 font-semibold w-fit">
            Trigger Type: {currentAction.variables?.trigger_type}
          </p>
        </div>
        <div class="ml-auto flex flex-col justify-center">
          <button
            data-action-id="0"
            on:click={toggleModal}
            class="bg-red-300 hover:bg-red-500 text-black rounded-lg max-w-md w-max p-3 my-auto btn"
            >Close</button
          >
        </div>
      </div>
      <div class="mt-2 p-3">
        <h3 class="font-bold text-xl">Set Variables</h3>
        <form on:submit|preventDefault={submitAction} method="post">
          <div class="md:grid grid-cols-2">
            <div class="flex flex-col gap-2 m-1 my-2 justify-between max-w-sm">
              <p class="font-semibold">Trigger Type*</p>
              <select
                name="trigger_type"
                class="border vorder-b-1 p-2"
                value={viewOnly === "true"
                  ? currentAction.variables["trigger_type"]
                  : Array.from(currentAction.trigger_type)[0]}
                required
              >
                {#each Array.from(currentAction.trigger_type) as option}
                  <option>{option}</option>
                {/each}
              </select>
            </div>
            {#each currentAction.required_variables as variable}
              <div
                class="flex flex-col gap-2 m-1 my-2 justify-between max-w-sm"
              >
                <p class="font-semibold">{variable}*</p>
                <input
                  class="border border-b-1 p-2"
                  type="text"
                  name={variable}
                  value={viewOnly === "true"
                    ? currentAction.variables[variable] || ""
                    : ""}
                  required
                />
              </div>
            {/each}
          </div>
          {#if viewOnly === "true"}
            <button
              data-action-type="edit"
              class="bg-yellow-300 hover:bg-yellow-400 btn rounded-lg text-black w-full md:w-max my-2 ml-auto"
              >Edit Action</button
            >
            <button
              on:click|preventDefault={() => {
                if (confirm("Are you Sure, you want to Delete this Action?")) {
                  deleteAction(form, currentAction.action.id);
                }
              }}
              class="bg-red-500 hover:bg-red-600 btn rounded-lg text-black w-full md:w-max my-2 ml-auto"
              >Remove Action</button
            >
          {:else}
            <button
              data-action-type="add"
              class="bg-green-500 hover:bg-green-600 btn rounded-lg text-black w-full md:w-max my-2 ml-auto"
              >Add Action</button
            >
          {/if}
        </form>
      </div>
    {/if}
  </dialog>
</main>
