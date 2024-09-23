"use client";

import React from "react";
import { makeColumns } from "./columns";
import { DataTable } from "./data-table";
import { Facility } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FacilityUpdateForm } from "@/components/facilities/facility-update-form";

type Props = {
  facilities: Facility[];
};

export const DataTableSection = ({ facilities }: Props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [clickedFacility, setClickedFacility] = React.useState<
    Facility | undefined
  >();

  const handleEditClick = (facility: Facility) => {
    setClickedFacility(facility);
    setDialogOpen(true);
  };

  const columns = makeColumns({
    onEditClick: handleEditClick,
  });

  return (
    <>
      <DataTable columns={columns} data={facilities} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-foreground">
              {clickedFacility ? (
                <FacilityUpdateForm
                  facility={clickedFacility}
                  onSuccess={() => {
                    setDialogOpen(false);
                    setClickedFacility(undefined);
                  }}
                />
              ) : null}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
