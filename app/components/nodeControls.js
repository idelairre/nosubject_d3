import React from 'react';
import ReactDOM from 'react-dom';
import { Typeahead } from 'react-typeahead';
import articles from '../../output/articles';
import ChartActions from '../actions/chartActions';
import InlineCss from 'react-inline-css';
import fuzzy from 'fuzzy';
import { memoize } from 'lodash';

function fuzzyMatch(pattern, str) {
  let cache = memoize((str) => {
    return new RegExp("^" + str.replace(/./g, (x) => {
      return /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/.test(x) ? "\\"+x+"?" : x+"?";
    })+"$");
  });
  if (cache(str.toLowerCase()).test(pattern.toLowerCase())) {
    return str;
  }
};

function displayOption(addedToken) {
  return addedToken;
}

export default class NodeControls extends React.Component {
  handleKeyDown(event) {
    if (event.keyCode === 13) {
      // let results = fuzzy.filter(event.target.value, articles);
      // let highestScore = Math.max.apply(Math, results.map((element) => { return element.score }));
      // results = results.map((element) => {
      //   if (element.score === highestScore) {
      //     return element;
      //   }
      // });
      // results = results.filter((element) => { return element !== undefined });
      // let minWCResult = Math.min.apply(Math, results.map((element) => {
      //   return element.string.split(' ').length;
      // }));
      // results = results.map((element => {
      //   if (element.string.split(' ').length === minWCResult) {
      //     return element;
      //   }
      // }));
      // results = results.filter((element) => { return element !== undefined });
      ::this.handleOptionSelected(event.target.value);
    }
  }

  handleOptionSelected(article) {
    ChartActions.generateLinkedNodes(article);
  }

  render() {
    return (
      <InlineCss stylesheet={`
       & .typeahead {
         positon: absolute;
         top: 0;
         left: 0;
       }
       & .listItem {
         position: relative;
         width: 50%;
         height: 100%;
         listStyle: none;
         float: left;
       }
       & .results {
         display: list-item;
         position: absolute;
         background: white;
         minWidth: 400px;
       }`}>
        <Typeahead
          ref="typeAhead"
          className={"typeahead"}
          placeholder="add nodes"
          options={articles}
          maxVisible={30}
          onOptionSelected={this.handleOptionSelected.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
          customClasses={{
           input: "typeahead",
           results: "results",
           listItem: "listItem"
         }}
        />
      </InlineCss>
    );
  }
}
