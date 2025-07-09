import { Card, Flex, Grid, IconButton, Stack, Text } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { LuUser, LuPen, LuTrash } from "react-icons/lu";

export default function CommentList({
  editable,
  deletable,
  editAction,
  deleteAction,
  data,
}) {
  return (
    <div>
      <Stack mt="30px">
        <Grid templateColumns="repeat(3, 1fr)" gap="6">
          {data.map((comment) => (
            <Card.Root key={comment.id} size="sm">
              <Card.Body color="fg.muted">
                {!comment.deleted_at ? (
                  <Text fontSize="md">{comment.content}</Text>
                ) : (
                  <Text fontSize="md">
                    This comment is deleted by {comment.deleted_by} at:{" "}
                    {new Date(comment.deleted_at).toLocaleString()}
                  </Text>
                )}

                <Flex mt="20px" justify="space-between">
                  <Flex align="center">
                    {/* Tooltips to show comment history */}
                    <Tooltip
                      content={
                        <div>
                          <Text>User: {comment.user}</Text>
                          <Text>
                            Created at:{" "}
                            {new Date(comment.created_at).toLocaleString()}
                          </Text>
                          {comment.edited_by && (
                            <>
                              <Text>Edited by: {comment.edited_by}</Text>
                              <Text>
                                Edited at:{" "}
                                {new Date(comment.edited_at).toLocaleString()}
                              </Text>
                            </>
                          )}
                          {comment.deleted_by && (
                            <>
                              <Text>Deleted by: {comment.deleted_by}</Text>
                              <Text>
                                Deleted at:{" "}
                                {new Date(comment.deleted_at).toLocaleString()}
                              </Text>
                            </>
                          )}
                        </div>
                      }
                    >
                      {/* Avatar Icon  */}
                      <IconButton rounded="full" colorPalette="orange">
                        <LuUser />
                      </IconButton>
                    </Tooltip>

                    <Text ml="6px" fontSize="sm">
                      {comment.user}
                    </Text>
                  </Flex>

                  {!comment.deleted_at ? (
                    <Flex>
                      {editable && (
                        <IconButton
                          variant="ghost"
                          color="green"
                          aria-label="Edit Comment"
                          onClick={() =>
                            editAction({
                              id: comment.id,
                              content: comment.content,
                            })
                          }
                        >
                          <LuPen />
                        </IconButton>
                      )}
                      {deletable && (
                        <IconButton
                          variant="ghost"
                          color="red"
                          aria-label="Delete Comment"
                          onClick={() => deleteAction(comment.id)}
                        >
                          <LuTrash />
                        </IconButton>
                      )}
                    </Flex>
                  ) : (
                    ""
                  )}
                </Flex>
              </Card.Body>
            </Card.Root>
          ))}
        </Grid>
      </Stack>
    </div>
  );
}
