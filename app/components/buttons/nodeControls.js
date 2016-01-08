import React from 'react';
import ReactDOM from 'react-dom';
import articles from '../../../output/articles';
import AddRandomNodes from './addRandomNodes';
import ChartActions from '../../actions/chartActions';
import DropdownMenu from './dropdownMenu';
import fuzzy from 'fuzzy';
import InlineCss from 'react-inline-css';
import { memoize } from 'lodash';
import { Typeahead } from 'react-typeahead';

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
  constructor(props) {
    super(props);
    this.state = { addRandomNodesStatus: "nodeInput--disabled", toggleRemove: false, placeholder: "add node", typeaheadStatus: "typeahead--active" };
  }

  handleToggle(val) {
    if (val === 'add node') {
      this.setState({ toggleRemove: false, addRandomNodesStatus: "nodeInput--disabled", typeaheadStatus: "typeahead--active", placeholder: val });
    } else if (val === 'add random nodes') {
      this.setState({ toggleRemove: false, typeaheadStatus: "typeahead--disabled", addRandomNodesStatus: "nodeInput--active" });
    } else if (val === 'remove node') {
      this.setState({ toggleRemove: true, addRandomNodesStatus: "nodeInput--disabled", typeaheadStatus: "typeahead--active", placeholder: val });
    } else {
      ChartActions.clearGraph();
    }
    console.log(this.state);
  }

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
    if (this.state.toggleRemove === false) {
      ChartActions.generateLinkedNodes(article);
    } else {
      ChartActions.removeNode(article);
    }
  }

  render() {
    return (
      <InlineCss stylesheet={`
       & {
         display: inline-flex;
         height: 21px;
         justifyContent: flex-start;
       }
       & input {
         border: 1px solid #A9A9A9;
         height: 19px;
       }
       & input:focus {
         outline: none;
       }
       & .dropdown {
         height: 21px;
         border: 1px solid #A9A9A9;
         display: inline-block;
         margin: 0px -1px;
       }
       & .typeahead--active {
         display: table-cell;
         positon: relative;
         top: 0;
         left: 0;
       }
       & .typeahead--disabled {
         visibility: hidden;
         height: 0px;
         width: 0px;
       }
       & .nodeInput--active {
         display: table-cell;
         positon: relative;
         top: 0;
         left: 0;
       }
       & .nodeInput--disabled {
         visibility: hidden;
         height: 0px;
         width: 0px;
       }
       & .listItem {
         position: relative;
         width: 50%;
         height: 100%;
         listStyle: none;
         float: left;
       }
       & .results {
         position: absolute;
         background: white;
         minWidth: 400px;
       }`}>
         <Typeahead
            className={this.state.typeaheadStatus}
            placeholder={this.state.placeholder}
            options={articles}
            maxVisible={30}
            onOptionSelected={this.handleOptionSelected.bind(this)}
            onKeyDown={this.handleKeyDown.bind(this)}
            customClasses={{
             input: "typeahead",
             results: "results",
             listItem: "listItem"
           }} />
          <AddRandomNodes className={this.state.addRandomNodesStatus} />
        <DropdownMenu className="dropdown" handleToggle={::this.handleToggle} />
      </InlineCss>
    );
  }
}
