<script>
  import { profile, updateProfile } from "$lib/stores/profile.js";
  import { Bar } from "svelte-chartjs";
  import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

  Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale );

  const MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];

  let user;
  let newPassword = "";
  let confirmPassword = "";
  let tab = "profile";

  function setTab(thistab) {
    tab = thistab;
  }

  async function saveChanges(e) {
    const formData = new FormData(e.target);
    const data = {};
    for (const key of formData.keys()) {
      data[key] = formData.get(key);
    }
    await updateProfile(data);
    window.location.reload();
  }

  // ChartJS
  const data = { labels: [], datasets: [{ label: 'Total Submissions', data: [], backgroundColor: [], borderWidth: 1 }] };
  var thisMonthUsage = 0;
  const populateBar = () => {
    if(user && user.meta.responses) {
      user.meta.responses.forEach((meta) => {
        const month = new Date(meta.month).getMonth();
        const thisMonth = new Date().getMonth();

        data.labels.push(MONTHS[month]);
        data.datasets[0].data.push(meta.count);

        const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 128)}, ${Math.floor(Math.random() * 128)}, 1)`;
        data.datasets[0].backgroundColor.push(randomColor);
        if(month === thisMonth){
          thisMonthUsage = meta.count;
        }
      });
    }
  }

  profile.subscribe((sub) => {
    user = sub;
    populateBar();
  });

  function changePassword() {
    // TODO: Implement changing password in database
    alert("Password changed!");
  }
</script>

<main class="max-w-2xl mx-auto my-8">
  <div class="bg-white shadow-lg border-2 rounded-3xl px-5 py-6 m-4">
    {#if tab == "profile"}
      {#if user}
        <div class="flex flex-col justify-center md:px-6 md:py-4 md:grid md:grid-cols-2 gap-5 mx-4">
          <div class="mx-auto w-fit flex flex-col justify-center">
            <img
              src={`https://ui-avatars.com/api/?background=000&color=fff&size=150&name=${user?.name}`}
              alt={user.name}
              class="rounded-full border-4 border-green-800"
            />
          </div>
          <div class="flex flex-col gap-2 text-center md:text-left">
            <div>
              <h2 class="font-bold text-2xl">{user.name}</h2>
              <p>@{user.username}</p>
            </div>
            <div>{user.email}</div>
            <p>
              User Since {MONTHS[new Date(user.createdAt).getUTCMonth()]}, {new Date(
                user.createdAt
              ).getFullYear()}
            </p>
          </div>
        </div>
        <div
          class="flex flex-col md:flex-row col-span-2 gap-3 w-fit justify-center mx-auto"
        >
          <button
            on:click={() => setTab("edit-profile")}
            class="btn btn-sm max-w-md mx-auto">Edit Profile</button
          >
          <!-- <button
            on:click={() => setTab("change-password")}
            class="btn btn-sm max-w-md mx-auto">Change Password</button> -->
        </div>
      {:else}
        <div class="flex flex-col justify-center md:px-6 md:py-4 md:grid md:grid-cols-2 gap-5 mx-4">
          <div class="mx-auto w-fit flex flex-col justify-center">
            <img
              src={`https://ui-avatars.com/api/?background=000&color=fff&size=150&name=...`}
              alt="skeleton"
              class="skeleton rounded-full border-4 border-green-800"
            />
          </div>
          <div class="flex flex-col gap-2 text-center">
            <div>
              <div class="skeleton skeleton-text" />
              <div class="skeleton skeleton-text" />
              <div class="skeleton skeleton-text" />
            </div>
            <div class="skeleton skeleton-text" />
            <div class="skeleton skeleton-text" />
            <div class="skeleton skeleton-text" />
            <div class="skeleton skeleton-text" />
            <div class="skeleton skeleton-text" />
            <div class="skeleton skeleton-text" />
            <div class="skeleton skeleton-text" />
            <div class="skeleton skeleton-text" />
          </div>
        </div>
      {/if}
    {:else if tab == "edit-profile"}
      <h2 class="text-2xl font-bold mb-6">Edit Profile</h2>
      <form method="post" on:submit|preventDefault={saveChanges}>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="name">
            Name
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={user.name}
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="username">
            Username
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            name="username"
            placeholder="johndoe"
            value={user.username}
          />
        </div>

        <div class="flex items-center justify-end gap-2">
          <button
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            on:click|preventDefault={() => setTab("profile")}>Cancel</button
          >
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save Changes
          </button>
        </div>
      </form>
    {:else if tab == "change-password"}
      <form class="mt-6">
        <h2 class="text-2xl font-bold mb-6">Change Password</h2>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="new-password">
            New Password
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="new-password"
            type="password"
            placeholder="********"
            bind:value={newPassword}
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="new-password">
            Confirm Password
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirm-password"
            type="password"
            placeholder="********"
            bind:value={confirmPassword}
          />
        </div>
        <div class="flex items-center justify-end gap-2">
          <button
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            on:click|preventDefault={() => setTab("profile")}>Cancel</button
          >
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            on:click={saveChanges}
          >
            Save Changes
          </button>
        </div>
      </form>
    {/if}

  </div>

  {#if tab == "profile" && user}
    <div class="flex flex-col gap-5 px-5">
      <div class="bg-white shadow-lg border-2 rounded-3xl px-5 py-6">
        <h2 class="text-2xl font-bold">API Usage</h2>
        <div class="my-3 flex flex-col gap-2">
          <label for="progress" class="flex justify-between flex-row">
            <p>Total Submissions this Month</p>
            <p>{thisMonthUsage} / 100</p>
          </label>
          <div class="w-full bg-gray-200 rounded-full h-3 mb-4 dark:bg-gray-700">
            <div class="bg-blue-600 h-3 rounded-full dark:bg-blue-500" style={`width: ${Math.floor(thisMonthUsage / 100 * 100)}%`}></div>
          </div>
        </div>
      </div>
      <div class="bg-white shadow-lg border-2 rounded-3xl px-5 py-6">
        <h2 class="text-2xl font-bold">History</h2>
        <Bar data={data} />
      </div>
    </div>
    <br>
    <br>
  {/if}
</main>
