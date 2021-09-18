import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { 
    Alert,
    Table,
    Button,
    Spinner 
} from 'reactstrap';

class ManageRoom extends React.Component {
    constructor() {
        super()
        this.state = {
            isLoaded: false,
            rooms: []
        }
    }

    componentDidMount() {
        axios.get(this.props.api + 'room/created-by/' + this.props.user.id)
            .then((response) => {
                console.log(response.data);
                this.setState({
                    isLoaded: true,
                    rooms: response.data
                });
            }).catch(error => {
                alert(error);
                console.log(error);
            });
    }

    handleDelete(id, index) {
        if (window.confirm("Are you sure you want to delete this room?")) {
            axios.delete(this.props.api + 'room/' + id)
                .then((response) => {
                    console.log(response)

                    // delete room from local state and refresh component
                    let rooms = [...this.state.rooms]
                    rooms.splice(index, 1)
                    this.setState({
                        rooms: rooms
                    })
                });
        }
    }

    render() {
        return (
            <div className="container main">
                <h1 className="mb-3">Manage Rooms</h1>

                <div className="clearfix">
                    <Button className="float-end">Create Room</Button>
                </div>
                
                {!this.state.isLoaded &&
                    <Spinner color="primary" />
                }

                {this.state.isLoaded && this.state.rooms.length > 0 &&
                    <Table className="manage-rooms mt-3">
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>

                        {this.state.rooms.map((room, i) => (
                            <tr key={room.id}>
                                <th scope="row">{ i + 1 }</th>
                                <td>{room.name}</td>
                                <td className="text-truncate">{room.description}</td>
                                <td className="text-right">
                                    <Button color="primary">Edit</Button>
                                    <Button color="danger" onClick={(i) => this.handleDelete(room.id, i)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                }

                {this.state.isLoaded && this.state.rooms.length === 0 &&
                    <Alert color="warning">
                        You have no rooms!
                    </Alert>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { 
        api: state.api,
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ManageRoom);