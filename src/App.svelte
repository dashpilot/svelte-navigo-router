<script>
  import { onMount } from 'svelte';
  import Navigo from "navigo";
  
  export let data;
  let router;
  let entries;
  
  if(data && data.ssr){      
    entries = data.entries.filter(x=>x.page==data.page)
  }
  
  onMount(async () => {
    var resp = await fetch(
      "https://api.eu-central-1.linodeobjects.com/test/data.json", {cache: "no-store"}
    );
    data = await resp.json();
    console.log(data)


    router = new Navigo("/");

    router.on("/", async function () {
      console.log("home")
      entries = data.entries.filter(x=>x.page=='home')
    });
  
    router.on("/about", async function () {
      console.log("about")
      entries = data.entries.filter(x=>x.page=='about')
    });
    
    router.on("/contact", async function () {
      console.log("contact")
      entries = data.entries.filter(x=>x.page=='contact')
    });
    setTimeout(()=>{
      router.resolve();
    }, 50)
    
   
      
  

    
  });
  

</script>


<nav>
  {#if data}
    {#each data.pages as item}
    {#if item.slug=='home'}
    <a href="/" data-navigo>{item.name}</a>
    {:else}
    <a href="/{item.slug}" data-navigo>{item.name}</a>
    {/if}
    {/each}
  {/if}
</nav>

<main>
 
  
  
  {#if entries}
 {#each entries as item}
 <h2>{item.title}</h2>
 {/each}
 {/if}
</main>

<style>
  nav{
    background-color: black;
    padding: 15px;
  }
  nav a{
    color: white;
    margin-right: 10px;
  }
  main{
    max-width: 100%;
    width: 600px;
    margin: 0 auto;
  }
</style>
