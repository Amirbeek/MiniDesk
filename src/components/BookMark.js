import { Grid } from "@mui/material";
import BookmarkItem from "./bookmark_component/BookmarkItem";
import { Plus } from "react-feather";
import styled from "styled-components";

const AddBookmarkItem =styled.div`
    text-align: center;
    cursor: pointer;
    color: #fff;
    .add {
        background-color: hsla(0, 0%, 100%, 0.4);
        height: 4rem;
        width: 4rem;
        border-radius: .8rem;
        margin: 10px auto;
        box-shadow: 0 0 .5rem 0 rgba(0, 0, 0, 0.1);
        padding-top: 6px;
        box-sizing: border-box;
        transition: all 0.3s ease;
    }

    &:hover .add {
        background-color: hsla(0, 0%, 100%, 0.78);
    }

    small {
        font-weight: bold;
        text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.54);
    }
`


function BookMark({ marks ,editMode}) {
    const handleClick = (link) => {
        window.open(link, '_blank');
    };

    return (
        <Grid container spacing={1} style={{ padding: '30px' }}>
            {marks.marks.map((bookmark) => (
                <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    key={bookmark._id}
                >
                    <BookmarkItem bookmark={bookmark} onClick={handleClick} editMode={editMode} />
                </Grid>
            ))}

            <Grid item xs={6} sm={4} md={3}>
                <AddBookmarkItem>
                    <div className={'add'}>
                        <Plus size={50} />
                    </div>
                    <small>
                        Add Bookmark
                    </small>
                </AddBookmarkItem>
            </Grid>
        </Grid>
    );
}

export default BookMark;

