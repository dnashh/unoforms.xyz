<script>
    import { login, signup } from '$lib/stores/auth'
    import { invalidateAll } from '$app/navigation';


    let fullName, email, password = '';

    export let View = 'login';
    let err = '';
    let button = true;

    const toggleView = (view) => {
        button = true;
        err = ''
        View = view        
    }

    const respCallback = (tag) => {
        if(tag?.status == 200 || tag?.status == 201){
            invalidateAll()
        } else {
            err = tag.response.data.error;
        }
    }

    const formAction = async () => {
        switch(View) {
            case 'login': login(email, password, respCallback); break;
            case 'signup': signup(fullName, email, password, respCallback); break;
            case 'forgot-password': err = await forgotPassword(email); button = false; break;
        }
    }




</script>

<svelte:head>
    <title>Login to Unoforms.xyz</title>
</svelte:head>

{#if View == 'login' }
<main class="h-full bg-gray-200 py-8 flex flex-col justify-center">
    <section class="flex flex-col justify-center h-fit w-max mx-auto p-2 rounded-xl bg-white">
        <form class=" md:mx-auto p-5 flex flex-col gap-3 w-full md:w-[500px] " method="post" on:submit|preventDefault={formAction}>
            <h1 class="text-xl font-bold text-center">Login to Your <span class="font-lobster text-2xl">unoForms</span> Account</h1>
            <fieldset class="flex flex-col gap-2 w-full h-full">
                <label for="login">Login</label>
                <input type="text" name="login" id="login" class="input input-bordered w-full max-w-xl" placeholder="Username or Email" bind:value={email} required />
            </fieldset>
            <fieldset class="flex flex-col gap-2">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" class="input input-bordered w-full max-w-xl" placeholder="********" bind:value={password} required />
            </fieldset>
            <button type="submit" class="px-3 py-2 bg-red-400 font-bold text-lg border-2 border-black mt-4">Login</button>
            <p class="text-red-500 text-center">{err}</p>
            <p class="text-center"><a href="/forgot-password" class="underline">Forgot Password?</a></p>
            <p class="text-center">Don't have an Account? <a href="/signup" class="underline">Create One</a></p>
        </form>
        <br><br>
    </section>
</main>
{/if}

{#if View == 'signup' }
<main class="h-full bg-gray-200 py-8 flex flex-col justify-center">
    <section class="flex flex-col justify-center h-fit w-fit p-2 bg-white rounded-xl mx-auto">
        <form class=" md:mx-auto p-5 flex flex-col gap-3 w-full md:w-[500px]" method="post" on:submit|preventDefault={formAction}>
            <h1 class="text-xl font-bold text-center">Create a new <span class="font-lobster text-2xl">unoForms</span> Account</h1>
            <fieldset class="flex flex-col gap-2 w-full h-full">
                <label for="name">Name</label>
                <input type="text" name="name" id="name" class="input input-bordered w-full max-w-xl" placeholder="Full Name" bind:value={fullName} required />
            </fieldset>
            <fieldset class="flex flex-col gap-2">
                <label for="email">Email</label>
                <input type="email" name="wmail" id="email" class="input input-bordered w-full max-w-xl" placeholder="user@example.com" bind:value={email} required />
            </fieldset>
            <fieldset class="flex flex-col gap-2">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" class="input input-bordered w-full max-w-xl" placeholder="********" bind:value={password} required />
            </fieldset>
            <input type="submit" value="Create Account" class="px-3 py-2 bg-red-400 font-bold text-lg border-2 border-black mt-4">
            <p class="text-red-500 text-center">{err}</p>
            <p class="text-center">Already have an Account? <a href="/login" class="underline">Login</a></p>
        </form>
        <br><br>
    </section>
</main>
{/if}

{#if View == 'forgot-password'}
<main class="h-full bg-gray-200 py-8">
    <section class="flex flex-col justify-center h-full w-full p-2 ">
        <form class="bg-white md:mx-auto p-5 flex flex-col gap-3 w-full md:w-[500px] rounded-xl" method="post" on:submit|preventDefault={formAction}>
            <h1 class="text-xl font-bold text-center">Reset your Password</h1>
            <fieldset class="flex flex-col gap-2">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" class="input input-bordered w-full max-w-xl" placeholder="user@example.com" bind:value={email} required />
            </fieldset>

            {#if button}
                <input type="submit" value="Send Reset Link" class="px-3 py-2 bg-red-400 font-bold text-lg border-2 border-black mt-4">
            {:else}
                <p class="text-center">Email Sent if User Exists! Check your Inbox</p>
            {/if}
            
            <p class="text-center">Already have an Account? <a href="/login" class="underline">Login</a></p>
        </form>
    </section>
</main>
{/if}
