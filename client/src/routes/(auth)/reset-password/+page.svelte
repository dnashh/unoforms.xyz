<script>
    import { page } from '$app/stores'
    import { resetPassword } from '$lib/stores/auth'

    const token = $page.url.searchParams.get('token');
    let password, confirm, message = '';
    const formAction = async () => {
        if(password == confirm){
            message = ''
            message = await resetPassword(token, password);
        } else {
            message = 'Password and Confirm Password Doesn\'t match'
        }
    }
</script>

<main class="h-full py-8 bg-base-200">
    <section class="flex flex-col justify-center h-full w-full p-2">
        <form class="md:mx-auto p-5 flex flex-col gap-3 w-full md:w-[500px] rounded-xl border-2" method="post" on:submit|preventDefault={formAction}>
            <h1 class="text-xl font-bold text-center">Enter New Password</h1>
            <fieldset class="flex flex-col gap-2 w-full h-full">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" class="px-3 py-1 border-2 border-black" placeholder="********" bind:value={password} required />
            </fieldset>
            <fieldset class="flex flex-col gap-2">
                <label for="confirm">Confirm Password</label>
                <input type="password" name="confirm" id="confirm" class="px-3 py-1 border-2 border-black" placeholder="********" bind:value={confirm} required />
            </fieldset>
            <button type="submit" class="px-3 py-2 btn btn-primary font-bold text-lg border-2 border-black mt-4">Reset Password</button>
            <p class="text-center">{message}</p>
        </form>
    </section>
</main>