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
      "https://api.eu-central-1.linodeobjects.com/navigo/data.json", {cache: "no-store"}
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
    
   
      // this allows you to update the data externally
      window.update = (mydata) => {
        console.log(mydata)
        console.log('updating')
        data = mydata;
        data = data;
        entries = data.entries.filter(x=>x.page==window.page)
      }
  

    
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

<div class="main mt-5">
 
  
  
  {#if entries}
 {#each entries as item}
 <section class="editable" id="{item.id}" data-fields="title=txt&amp;body=rte&amp;image=img&amp;delete=del">
 <h2>{item.title}</h2>
 {@html item.body}
 </section>
 {/each}
 {/if}
</div>

<style>
  nav{
    background-color: black;
    padding: 15px;
  }
  nav a{
    color: white;
    margin-right: 10px;
  }
  .main{
    max-width: 100%;
    width: 600px;
    margin: 0 auto;
  }
  section{
    padding-top: 20px;
    padding-bottom: 20px;
  }
</style>
