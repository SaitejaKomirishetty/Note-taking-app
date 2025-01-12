import { useMemo, useState } from 'react';
import {
    Badge,
    Button,
    Card,
    Col,
    Form,
    Modal,
    Row,
    Stack,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';
import { Tag } from './App';
import styles from './NoteList.module.css';

type EditTagsModalProps = {
    availableTags: Tag[];
    show: boolean;
    handleClose: () => void;
    onUpdateTag: (id: string, label: string) => void;
    onDeleteTag: (id: string) => void;
};

type SimplifiedNote = {
    id: string;
    title: string;
    tags: Tag[];
};

type NoteListProps = {
    availableTags: Tag[];
    notes: SimplifiedNote[];
    onUpdateTag: (id: string, label: string) => void;
    onDeleteTag: (id: string) => void;
};

const NoteList = ({
    availableTags,
    notes,
    onUpdateTag,
    onDeleteTag,
}: NoteListProps) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState('');
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

    const filteredNotes = useMemo(() => {
        return notes.filter((note) => {
            return (
                (title === '' ||
                    note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 ||
                    selectedTags.every((tag) =>
                        note.tags.some((noteTag) => noteTag.id === tag.id)
                    ))
            );
        });
    }, [title, selectedTags, notes]);

    return (
        <>
            <Row className='align-items-center mb-4'>
                <Col>
                    <h1>Notes</h1>
                </Col>
                <Col xs='auto'>
                    <Stack direction='horizontal' gap={2}>
                        <Link to='/new'>
                            <Button variant='primary'>Create</Button>
                        </Link>
                        <Button
                            onClick={() => setEditTagsModalIsOpen(true)}
                            variant='outline-secondary'
                        >
                            Edit Tags
                        </Button>
                    </Stack>
                </Col>
            </Row>
            <div className=' border border-dark rounded-5 p-5 h-100'>
                <Form>
                    <Row className='mb-4'>
                        <Col sm='auto' className='align-items-center justify-content-center'>
                            <h2>Search</h2>
                        </Col>
                        <Col>
                            <Form.Group controlId='title'>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId='tags'>
                                <Form.Label>Tags</Form.Label>
                                <ReactSelect
                                    value={selectedTags.map((tag) => {
                                        return {
                                            label: tag.label,
                                            value: tag.id,
                                        };
                                    })}
                                    options={availableTags.map((tag) => {
                                        return {
                                            label: tag.label,
                                            value: tag.id,
                                        };
                                    })}
                                    onChange={(tags) => {
                                        setSelectedTags(
                                            tags.map((tag) => {
                                                return {
                                                    label: tag.label,
                                                    id: tag.value,
                                                };
                                            })
                                        );
                                    }}
                                    isMulti
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <Row xs={1} sm={2} lg={3} xl={4} className='gap-3'>
                    {filteredNotes.map((note) => {
                        return (
                            <Col key={note.id}>
                                <NoteCard
                                    id={note.id}
                                    title={note.title}
                                    tags={note.tags}
                                />
                            </Col>
                        );
                    })}
                </Row>
            </div>
            <EditTagsModal
                availableTags={availableTags}
                show={editTagsModalIsOpen}
                handleClose={() => {
                    setEditTagsModalIsOpen(false);
                }}
                onUpdateTag={onUpdateTag}
                onDeleteTag={onDeleteTag}
            />
        </>
    );
};

export default NoteList;

function NoteCard({ id, title, tags }: SimplifiedNote) {
    return (
        <Card
            as={Link}
            to={`/${id}`}
            className={`h-100 text-reset text-decoration-none ${styles.card} `}
        >
            <Card.Body>
                <Stack
                    gap={2}
                    direction='vertical'
                    className='align-items-center justify-content-center h-100'
                >
                    <span className='fs-5'>{title}</span>
                    {tags.length > 0 && (
                        <Stack
                            gap={1}
                            direction='horizontal'
                            className='justify-content-center flex-wrap'
                        >
                            {tags.map((tag) => {
                                return (
                                    <Badge
                                        className='text-truncate'
                                        key={tag.id}
                                    >
                                        {tag.label}
                                    </Badge>
                                );
                            })}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    );
}

function EditTagsModal({
    availableTags,
    handleClose,
    show,
    onUpdateTag,
    onDeleteTag,
}: EditTagsModalProps) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Tags</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}>
                        {availableTags.map((tag) => {
                            return (
                                <Row key={tag.id}>
                                    <Col>
                                        <Form.Control
                                            value={tag.label}
                                            type='text'
                                            onChange={(e) =>
                                                onUpdateTag(
                                                    tag.id,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Col>
                                    <Col xs='auto'>
                                        <Button
                                            variant='outline-danger'
                                            onClick={() => onDeleteTag(tag.id)}
                                        >
                                            X
                                        </Button>
                                    </Col>
                                </Row>
                            );
                        })}
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
