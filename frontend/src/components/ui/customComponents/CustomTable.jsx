import { useState } from "react";
import {
  Table,
  ButtonGroup,
  IconButton,
  Stack,
  Badge,
  HStack,
} from "@chakra-ui/react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuLockKeyholeOpen,
  LuPencil,
  LuTrash,
} from "react-icons/lu";

const CustomTable = ({
  columns,
  data,
  pageSize = 5,
  onEdit,
  onDelete,
  accessAction,
  showActions = true,
}) => {
  const totalPages = Math.ceil(data.length / pageSize);
  const [page, setPage] = useState(1);

  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

  const renderCellContent = (col, row) => {
    let value =
      typeof col.accessor === "function"
        ? col.accessor(row)
        : row[col.accessor];

    if (typeof value === "boolean") {
      return (
        <Badge colorPalette={value ? "green" : "red"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      );
    }

    return value;
  };

  return (
    <Stack width="full" gap="4">
      <Table.Root size="sm" variant="outline" striped>
        <Table.Header>
          <Table.Row>
            {columns.map((col, idx) => (
              <Table.ColumnHeader key={idx} textAlign={col.align || "start"}>
                {col.header}
              </Table.ColumnHeader>
            ))}
            {showActions && (
              <Table.ColumnHeader textAlign="center">
                Actions
              </Table.ColumnHeader>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedData.map((row, idx) => (
            <Table.Row key={idx}>
              {columns.map((col, i) => (
                <Table.Cell key={i} textAlign={col.align || "start"}>
                  {renderCellContent(col, row)}
                </Table.Cell>
              ))}
              {showActions && (
                <Table.Cell textAlign="center">
                  <HStack spacing={4} justify="center">
                    <IconButton
                      size="sm"
                      aria-label="Edit"
                      color="orange"
                      bg="transparent"
                      onClick={() => onEdit?.(row)}
                    >
                      <LuPencil />
                    </IconButton>
                    <IconButton
                      size="sm"
                      aria-label="Delete"
                      color="red"
                      bg="transparent"
                      onClick={() => onDelete?.(row)}
                    >
                      <LuTrash />
                    </IconButton>
                    <IconButton
                      size="sm"
                      aria-label="Delete"
                      color="blue"
                      bg="transparent"
                      onClick={() => accessAction?.(row)}
                    >
                      <LuLockKeyholeOpen />
                    </IconButton>
                  </HStack>
                </Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <ButtonGroup variant="outline" size="sm" justifyContent="left">
        <IconButton
          aria-label="Previous Page"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          isDisabled={page === 1}
        >
          <LuChevronLeft />
        </IconButton>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <IconButton
            key={p}
            onClick={() => setPage(p)}
            variant={page === p ? "solid" : "outline"}
            aria-label={`Page ${p}`}
          >
            {p}
          </IconButton>
        ))}

        <IconButton
          aria-label="Next Page"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          isDisabled={page === totalPages}
        >
          <LuChevronRight />
        </IconButton>
      </ButtonGroup>
    </Stack>
  );
};

export default CustomTable;
