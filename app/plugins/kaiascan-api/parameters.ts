import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

// No parameters needed for basic Kaia stats call
export class GetKaiaStatsParameters extends createToolParameters(
    z.object({}),
) {}