import React from 'react';
import ReactDOM from 'react-dom';
import AddRandomNodes from './addRandomNodes';
import articles from '../../../output/articles';
import ChartActions from '../../actions/chartActions';
import DropdownMenu from './dropdownMenu';
import fuzzy from 'fuzzy';
import graphGenerator from '../../source/graphGenerator';
import InlineCss from 'react-inline-css';
import ToggleBacklinks from './toggleBacklinks';
import { memoize } from 'lodash';
import { Typeahead } from 'react-typeahead';

export default class NodeControls extends React.Component {
  static defaultProps = {
    initialAddRandomNodesStatus: "nodeInput--disabled",
    initialData: articles,
    initialPlaceholder: "add node",
    initialToggleBacklinks: false,
    initialToggleRemove: false,
    initialTypeaheadStatus: "typeahead--active",
    initialValue: ''
  };

  static propTypes = {
    addRandomNodesStatus: React.PropTypes.string,
    data: React.PropTypes.array,
    placeholder: React.PropTypes.string,
    toggleBacklinks: React.PropTypes.bool,
    toggleRemove: React.PropTypes.bool,
    typeaheadStatus: React.PropTypes.string,
    value: React.PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      addRandomNodesStatus: this.props.initialAddRandomNodesStatus,
      data: this.props.initialData,
      placeholder: this.props.initialPlaceholder,
      toggleBacklinks: this.props.initialToggleBacklinks,
      toggleRemove: this.props.initialToggleRemove,
      typeaheadStatus: this.props.initialTypeaheadStatus,
      value: this.props.initialValue
     };
  }

  displayOption(option, index) {
    if (this.state.data === articles) {
      return option.title;
    } else {
      return option.label;
    }
  }

  fuzzyMatch(pattern, item) {
    let cache = memoize((str) => {
      return new RegExp("^" + str.replace(/./g, (x) => {
        return /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/.test(x) ? "\\"+x+"?" : x+"?";
      })+"$");
    });
    if (this.state.data === articles) {
      if (cache(item.title.toLowerCase()).test(pattern.toLowerCase())) {
        return item.title;
      }
    } else {
      let node = item;
      if (cache(node.label.toLowerCase()).test(pattern.toLowerCase())) {
        return node.label;
      }
    }
  };

  handleBacklinks(value) {
    this.setState({ toggleBacklinks : value });
  }

  handleToggle(val) {
    if (val === 'add node') {
      this.setState({ toggleRemove: false, addRandomNodesStatus: "nodeInput--disabled", data: articles, typeaheadStatus: "typeahead--active", placeholder: val });
    } else if (val === 'add random nodes') {
      this.setState({ toggleRemove: false, typeaheadStatus: "typeahead--disabled", addRandomNodesStatus: "nodeInput--active" });
    } else if (val === 'remove node') {
      this.setState({ addRandomNodesStatus: "nodeInput--disabled", data: graphGenerator.storedNodes, toggleRemove: true, typeaheadStatus: "typeahead--active", placeholder: val });
    } else {
      ChartActions.clearGraph();
    }
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.setState({ value: null });
      ::this.handleOptionSelected(event.target.value);
    }
  }

  handleOptionSelected(article) {
    if (this.state.toggleRemove === false) {
      ChartActions.generateLinkedNodes(article, this.state.toggleBacklinks);
    } else {
      article.label ? article = article.label : null;
      ChartActions.removeNode(article); // returns a node not an article name
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
            displayOption={::this.displayOption}
            filterOption={::this.fuzzyMatch}
            options={this.state.data}
            maxVisible={30}
            onOptionSelected={this.handleOptionSelected.bind(this)}
            placeholder={this.state.placeholder}
            onKeyDown={this.handleKeyDown.bind(this)}
            customClasses={{
             input: "typeahead",
             results: "results",
             listItem: "listItem"
           }} />
          <ToggleBacklinks className={this.state.typeaheadStatus} handleBacklinks={::this.handleBacklinks} />
          <AddRandomNodes className={this.state.addRandomNodesStatus} />
        <DropdownMenu className="dropdown" handleToggle={::this.handleToggle} />
      </InlineCss>
    );
  }
}
