# nosubject d3
a quick and dirty scraper utility to create json to visualize articles and backlinks on nosubject.com with d3. there is a working copy here: http://idelairre.github.io/nosubject_d3/.

## to do
+ ~~make the graph a controlled React component~~ (note: there are major performance problems with this, there is a working version on the controlled_graph_test branch, the current implementation "sprinkles" new nodes onto the graph and keeps stock of nodes currently on the graph, the store basically handles async code, all business logic takes place in the graph generator, which more directly talks to the graph. A potential refactor would be to take the store out, remove promises from graph generator and handle async code with callbacks.)
+ ~~remove methods to generate json from d3Chart.js to index.js~~ (note: this is not possible with this graph strategy because of the way d3 indexes nodes.)
+ better styling and readability
+ ~~make the graph more performant (there is a massive slowdown after 400 nodes)~~
+ find a way to pre-generate nodes with static json rather than generate them in the browser (note: a lot of problems emerged here.)
+ make scraper methods work for other wikis besides nosubject.
+ tests

## conclusion
for more complicated force directed graphs, react does not yet play well with d3: http://stackoverflow.com/questions/30330646/how-to-create-a-d3-force-layout-graph-using-react/34485379#34485379
