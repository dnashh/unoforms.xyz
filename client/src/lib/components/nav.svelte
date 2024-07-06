<script>
  import { userStore, logout } from "$lib/stores/auth";
  let showDropdown = false;
  const toggleDropdown = () => {
    showDropdown = !showDropdown;
  };
</script>

<nav class="flex justify-between items-center px-2 md:px-10 py-2 sticky top-0 left-0 border-b navbar bg-base-100 z-50">
  <h1 class="flex flex-row gap-1 justify-center btn btn-ghost "><a href="/" class="font-lobster text-2xl font-bold my-auto normal-case">unoForms.xyz</a><span class="mb-5 p-1 rounded-md bg-blue-200">BETA</span></h1>

  {#if $userStore?.name}
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <div class="dropdown dropdown-end">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <!-- svelte-ignore a11y-missing-attribute -->
          <img src={`https://ui-avatars.com/api/?background=000&color=fff&size=150&name=${$userStore?.name}`} />
        </div>
      </label>
      <ul
        tabindex="0"
        class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
      >
        <li class="p-2">👋 Hello {$userStore.name}</li>
        <hr>
        <li><a href="/profile" class="justify-between">Profile</a></li>
        <li><a href="." on:click={logout}>Logout</a></li>
      </ul>
    </div>
  {/if}
</nav>
