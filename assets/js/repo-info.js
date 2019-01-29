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
      count: {{counter}}
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
  id: '{{collection.label}}',
  title: '{{collection.title}}',
  tags: [
    {% for tag in collection.tags %}
      "{{tag}}"{% if forloop.last == false %},{% endif%}
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
    }{% if forloop.last == false %},{% endif%}
    {% endfor %}
  ]
},
  {% endif%}
  {% endfor %}
],
});