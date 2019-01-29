---
---
if (!window.repoInfo) {
  window.repoInfo = []
}
window.repoInfo.push({
  name: "{{site.repository_name}}",
  baseurl: "{{site.baseurl}}",
  description: "{{site.description}}",
  tags: [
    {% for tag in site.repo-tags %}
      '{{tag}}'{% if forloop.last == false %},{% endif%}
    {% endfor %}
  ],
  series: [
    {% for serie in site.data.series %}
      {
        title: '{{serie.title}}',
        id: '{{serie.id}}',
        classrooms: [
          {% for classroom in serie.classrooms %}
            '{{classroom}}'{% if forloop.last == false %},{% endif%}
          {% endfor %}
        ],
        tags: [
          {% for tag in serie.tags %}
            '{{tag}}'{% if forloop.last == false %},{% endif%}
          {% endfor %}
        ]
      }{% if forloop.last == false %},{% endif%}
    {% endfor %}
  ],
{% assign site_authors = "" | split: ',' %}
{% for site_collection in site.collections %}
  {% for doc in site_collection.docs %}
    {% for _author in doc.authors %}
      {% assign site_authors = site_authors | push: _author %}
    {% endfor %}
  {% endfor %}
{% endfor %}
{% assign unique_site_authors  = site_authors | uniq %}
  contributors: [
{% assign unique_site_authors_count = "" | split: ',' %}
{% for auth in unique_site_authors %}
  {% assign counter = 0 %}
  {% for site_author in site_authors %}
    {% if site_author == auth%}
      {% assign counter = counter | plus: 1 %}
    {% endif%}
  {% endfor %}
   {
      name: "{{auth}}",
      count: {{counter}},
   }
   {% if forloop.last == false %}
   ,
   {% endif%}
{% endfor %}
],
classes: [
  {% for collection in site.collections %}
  {% if collection.label != 'doctags' and collection.label != 'posts'%}
{
  title: '{{collection.title}}',
  tags: [
    {% for tag in collection.tags %}
      "{{tag}}",
    {% endfor %}
  ],
  pages: [
    {% assign docs = collection.docs | sort: 'index' %}
    {% for doc in docs %}
    {
      title: '{{doc.nav_title}}',
      url: '{{doc.url| prepend: site.baseurl}}',
      tags: [
        {% for tag in doc.tags %}
          '{{tag}}'{% if forloop.last == false %},{% endif%}
        {% endfor %}]
    },
    {% endfor %}
  ],
},
  {% endif%}
  {% endfor %}
],
});
const reposHandler = {
  randomNumBetween: (min, max) => {
    return Math.round(Math.random() * (max - min + 1) + min);
  },
  setCacheDate: () => {
    const date = new Date()
    const yyyy = date.getFullYear()
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours()
    return `${yyyy}-${mm}-${dd}-${hh}`

  },
  endpoints: [
  {% for repository in site.github.public_repositories %}
    {% if repository.description contains "#docs" and repository.name != "docs" %}
    `https://pages.github.schibsted.io/blocket/{{repository.name}}/_assets/js/repo-info.js`,
    {% endif%}
  {%endfor%}
  ],
  run: async () => {
      const date = new Date("2013-03-01T01:10:00")
      const promises = reposHandler.endpoints.map(async endpoint => {

        const promise = new Promise(
          (resolve, reject) => {
            const scriptTag = document.createElement("script")
            scriptTag.src = `${endpoint}?cache=${reposHandler.setCacheDate()}`
            scriptTag.onload = e => {
              resolve('success')
            }
            scriptTag.onerror = e => {
              resolve('success') // Lets pass anyway if the loaded script fails. This so those which did pass can be consumed.
            }
            document.getElementsByTagName('head')[0].appendChild(scriptTag)
        })

        return promise
    })

    await Promise.all(promises)

    /*
    * After all promises above is fullfilled the application has collected all needed
    * info about all repos and are ready to interact
    */

   reposHandler.contributors = reposHandler.collectContributors()
   runOnHook('REPOS_LOADED');
  },
  collectTags: () => {
    let commonTags = []
    window.repoInfo.forEach(repo => {
      repo.classes.forEach(cls => {
        cls.tags.forEach(t => {
          if (!commonTags.some(cT => cT === t)) {
            commonTags.push(t)
          }
        })
        cls.pages.forEach(page => {
          if (page.hasOwnProperty('tags')) {
            page.tags.forEach(pT => {
              if (!commonTags.some(cT => cT === pT)) {
                commonTags.push(pT)
              }
            })
          }
        })
      })
    })
    commonTags = reposHandler.sortArray3(commonTags, '')
    return commonTags
  },
  collectClasses: tag => {
    let classes = []
    window.repoInfo.forEach(repo => {
      repo.classes.forEach(cls => {
        const match = cls.tags.find(item => item === tag)
        if (match) {
          cls.isExternal = false;
          cls.repo = repo.name;
          if (repo.name !== "Blocket Docs") {
            cls.isExternal = true;
          }
          classes.push(cls)
        }
      })
    })
    classes = reposHandler.sortArray2(classes, 'title')
    return classes
  },
  sortArray: (arr, key) => {
    return arr.sort((function(index){
      return function(a, b){
        return (a[index] === b[index] ? 0 : (a[index] > b[index] ? -1 : 1));
      };
    })(key));
  },
  sortArray2: (arr, key) => {
    return arr.sort((function(index){
      return function(a, b){
        return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1));
      };
    })(key));
  },
  sortArray3: (arr, key) => {
    return arr.sort((function(index){
      return function(a, b){
        return (a === b ? 0 : (a < b ? -1 : 1));
      };
    })(key));
  },
  contributors: [],
  commonTags: [],
  collectContributors: () => {
    let contributors = []
    window.repoInfo.forEach(repo => {
      repo.contributors.forEach(cont => {
        const selected = contributors.find(item => item.name === cont.name)
        if (selected) {
          selected.count = Math.floor(Number(selected.count) + Number(cont.count))
          contributors = contributors.filter(item => item.name !== cont.name)
          contributors.push(selected)

        } else {
          contributors.push(cont)
        }
      });
    });
    contributors = reposHandler.sortArray(contributors, 'count')
    return contributors
  },
}
addToHook("PAGE_LOADED", () => {reposHandler.run()})
