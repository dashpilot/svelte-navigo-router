<script>
  import { onMount } from 'svelte';
  import Navigo from "navigo";
  
  export let data;
  let router;
  let entries;
  let notfound = false;
  
  if(data && data.ssr && data.isPage){      
    entries = data.entries.filter(x=>x.page==data.page)
  }
  if(data && data.ssr && data.isEntry){      
    entries = data.entries.filter(x=>x.id==data.id)
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
      notfound = false;
      entries = data.entries.filter(x=>x.page=='home')
    });
    
    data.pages.forEach(item=>{
      router.on("/"+item.slug, async function () {
        console.log("about")
        notfound = false;
        entries = data.entries.filter(x=>x.page==item.slug)
      });
    })
    
    data.entries.forEach(item=>{
      router.on("/article/"+slugify(item.title, item.id), async function () {
        console.log("about")
        notfound = false;
        entries = data.entries.filter(x=>x.id==item.id)
      });
    })
    
    router.notFound(() => {
      // this runs if there is no match found
      notfound = true;
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
        entries = data.entries.filter(x=>x.page==mydata.page)
      }
    
  });
  
  function slugify(str, id){
    
        if(str.length < 3){
          str = str+"-"+id;
        }
  
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();
      
        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaeeeeiiiioooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
    
        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes
    
        return str;
  }
 

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
     <h2><a href="/article/{slugify(item.title, item.id)}" data-navigo>{item.title}</a></h2>
     {@html item.body}
     </section>
   {/each}
 {/if}
 
 {#if notfound}
  <h2>Error 404</h2>
  <p>Not Found</p>
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
