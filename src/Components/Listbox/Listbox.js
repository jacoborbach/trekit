import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";

export default function Listbox() {
  return (
    <Box sx={{ width: "75%", maxWidth: 360, bgcolor: "background.paper" }}>
      <nav aria-label="main edit buttons">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Edit" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Delete" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}
