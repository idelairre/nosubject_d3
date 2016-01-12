export default class Validator {
  checkNodes(nodes, links) {
    let errors = 0;
    for (let j = 0; j < links.length - 1; j += 1) {
      let targetIndex = nodes.indexOf(links[j].target);
      let sourceIndex = nodes.indexOf(links[j].source);
      if (nodes[targetIndex]) {
        console.log(`target node ${JSON.stringify(nodes[targetIndex])} referenced at link ${JSON.stringify(links[j])} is OK`);
      } else {
        console.error(`target node at ${targetIndex} referenced at link ${JSON.stringify(links[j])} is shit, index position: ${targetIndex}`);
        delete nodes[j];
        errors += 1;
      }
      if (nodes[sourceIndex]) {
        console.log(`source node ${JSON.stringify(nodes[sourceIndex])} referenced at link ${JSON.stringify(links[j])} is OK`);
      } else {
        console.error(`source node at ${sourceIndex} referenced at link ${JSON.stringify(links[j])} is shit, index position: ${sourceIndex}`);
        delete nodes[j];
        errors += 1;
      }
    }
    console.error('errors: ', errors);
    if (errors > 0) {
      links = links.filter((element) => {
        return (typeof element !== "undefined");
      });
    }
    errors > 0 ? console.log('links repaired') : null;
  }

  checkLabels(labelAnchors, labelAnchorLinks) {
    let errors = 0;
    for (let i = 0; labelAnchorLinks.length - 1 > i; i += 1) {
      let targetIndex = labelAnchors.indexOf(labelAnchorLinks[i].target);
      let sourceIndex = labelAnchors.indexOf(labelAnchorLinks[i].source);
      if (labelAnchors[targetIndex]) {
        console.log(`target node ${JSON.stringify(labelAnchors[targetIndex])} referenced at link ${JSON.stringify(labelAnchorLinks[i])} is OK`);
      } else {
        console.error(`target label index ${targetIndex} referenced at link ${JSON.stringify(labelAnchorLinks[i])} is shit, index position: ${targetIndex}`);
        delete labelAnchorLinks[i];
        errors += 1;
      }
      if (labelAnchors[sourceIndex]) {
        console.log(`source node ${JSON.stringify(labelAnchors[sourceIndex])} referenced at link ${JSON.stringify(labelAnchorLinks[i])} is OK`);
      } else {
        console.error(`source label index ${sourceIndex} referenced at link ${JSON.stringify(labelAnchorLinks[i])} is shit, index position: ${sourceIndex}`);
        delete labelAnchorLinks[i];
        errors += 1;
      }
    }
    console.log('errors: ', errors);
    if (errors > 0) {
      labelAnchorLinks = labelAnchorLinks.filter((element) => {
        return (typeof element !== "undefined");
      });
    }
    errors > 0 ? console.log('label links repaired') : null;
  }
}
