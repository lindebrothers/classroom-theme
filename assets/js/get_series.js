---
---

const Series = {
  items: [
    {% for serie in site.data.series %}
      {
        nav_title: "{{serie.title}}",
        id: "{{serie.id}}",
        classrooms: [
        {% for classroom in serie.classrooms %}

          {% for site_collection in site.collections %}
            {% if site_collection.label == classroom %}
              {% assign collection_title = site_collection.title %}
              {% assign firstDoc = site_collection.docs | sort: 'index' | first %}
            {% endif %}
          {% endfor %}
          {
            nav_title: "{{collection_title}}",
            name: "{{classroom}}",
            url: "{{firstDoc.url | prepend: site.baseurl}}",
          },
        {% endfor %}
        ],
      },
    {% endfor %}
  ],
  getNextClassrooms: function (serie, doc) {

    const _serie = this.items.find(item => item.id === serie)

    if (!_serie) {
      return null
    }
    let index = _serie.classrooms.findIndex(item => item.name === `${doc}`)
    if (index !== -1 && index < (_serie.classrooms.length - 1) ) {
      index = index + 1
    } else {
      return null
    }
    return _serie.classrooms[index]
  },
  getPreviousClassrooms: function (serie, doc) {

    const _serie = this.items.find(item => item.id === serie)
    if (!_serie) {
      return null
    }

    let index = _serie.classrooms.findIndex(item => item.name === `${doc}`)

    if (index !== -1 && index > 0 ) {
      index = index - 1
    } else {
      return null
    }
    return _serie.classrooms[index]
  },
  getSerie: function (doc) {
    let serie = null
    this.items.forEach(_serie => {
      const match = _serie.classrooms.find(item => item.name === `${doc}`)
      if (match) {
        serie = _serie
      }
    })
    return serie
  }
}