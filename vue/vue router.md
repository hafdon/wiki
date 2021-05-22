https://www.vuemastery.com/courses/touring-vue-router/receiving-url-parameters

- router
	- params object mode
	- params function mode
- pagination
	- event service api
		- change get functions to take page and perPage params
	- router: get query `page` param , cast to `int`, set to `1` as default if not defined
	- event list component
		- specify props: `page`
		- `created()`: EventService.getEvents(2, perPage)
	- add pagination links to list template
		- `<router-link :to="name: 'EventList', query: { page: page - 1}}" rel="prev" v-if="page !- 1"`
		- router-link for next
			- rel="next"
			- the v-if is more complicated
	- problem: make another API call when page is updated
		- vue3
			- import { watchEffect } from 'vue'
				- in created, use if to wrap API call
				- (we can move this API call out too)
				- set events = null first
		- tell router-view in App.vue to use $route.fullPath as key (`:key=""\$route.fullPath"`)
	- checking for existence of nextPage link 
		- need to know totalEvents
		- api call returns header with this info
		- set total events using that call
		- use that info in computed property `hasnNextPage` 
			- math.ceil(this.totalEvents / events per page?)
			- return false if this is not last page
- make pretty
	- class="pagination"
	- givec router links ids
	- put arrows in link stuff
	- .pagination using flex box

### nested routes
