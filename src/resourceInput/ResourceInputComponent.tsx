import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import '../app/app.css';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';


import { createResourceCount, updateResource, updateCount, deleteResourceCount, RootAction } from '../redux/actions';
import RootState from '../redux/rootState';


import { ResourceCount } from '../datacomponents/index';

interface StateProps{
    values: ResourceCount[];
}
interface DispatchProps{
    handleAddResource: (event: React.MouseEvent<{}>) => void;
    handleChangeResource: (index: number) => (event: React.FormEvent<HTMLInputElement>) => void;
    handleChangeCount: (index: number) => (event: React.FormEvent<HTMLInputElement>) => void;
    handleDelete: (index: number) => (event: React.MouseEvent<{}>) => void;
}
type ResourceInputComponentUIProps = StateProps & DispatchProps;

const ResourceInputComponentUI: React.StatelessComponent<ResourceInputComponentUIProps> = ({values, handleAddResource, handleChangeResource, handleChangeCount, handleDelete}) => 
(
<div>
    <div>
        <FlatButton onClick={handleAddResource} label="Add Resource" />
    </div>
    <Table>
        <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}>
        <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Amount</TableHeaderColumn>
            <TableHeaderColumn>Delete</TableHeaderColumn>
        </TableRow>
        </TableHeader>
        <TableBody
                displayRowCheckbox={false}>
            {values.map((value, i) => {
            return (<TableRow key={i} >
                <TableRowColumn>
                    <TextField
                        value={value.resource}
                        onChange={handleChangeResource(i)}
                        />
                </TableRowColumn>
                <TableRowColumn>
                    <TextField
                        value={value.count}
                        onChange={handleChangeCount(i)}
                        />
                </TableRowColumn>
                <TableRowColumn>
                    <IconButton
                        tooltip="Delete"
                        onClick={handleDelete(i)}>
                        <ActionDelete />
                    </IconButton>
                </TableRowColumn>

            </TableRow>)
            })}
        </TableBody>
        
    </Table>
  </div>
);

export interface ResourceInputUIOwnProps {
    storeName: string;
}

const mapStateToProps = (state : RootState, {storeName}: ResourceInputUIOwnProps) : StateProps => {
    return {
        values: state[storeName]
    };
};

const mapDispatchToProps = (dispatch: Dispatch<RootAction>, {storeName}: ResourceInputUIOwnProps) : DispatchProps => {
    return {
        handleAddResource: () => dispatch(createResourceCount(storeName)),
        handleChangeResource: (index: number) => {
            return (e) => dispatch(updateResource(storeName, index, e.currentTarget.value))
        },
        handleChangeCount: (index: number) => {
            return (e) => dispatch(updateCount(storeName, index, Number(e.currentTarget.value)))
        },
        handleDelete: (index: number) => {
            return (e) => dispatch(deleteResourceCount(storeName, index))
        }
    };
};

const ResourceInputComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(ResourceInputComponentUI);

export default ResourceInputComponent;
