<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdditionalFee\StoreAdditionalFeeRequest;
use App\Http\Requests\AdditionalFee\UpdateAdditionalFeeRequest;
use App\Http\Resources\AdditionalFeeResource;
use App\Models\AdditionalFee;
use App\Services\AdditionalFeeService;
use App\Services\Contracts\AdditionalFeeServiceInterface;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdditionalFeeController extends Controller
{
    public function __construct(
        private AdditionalFeeServiceInterface $additionalFeeService = new AdditionalFeeService()
    ) {
        //
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return AdditionalFeeResource::collection($this->additionalFeeService->getAdditionalFees())
            ->additional([
                'message' => 'Additional fees retrieved successfully'
            ])->response()
            ->setStatusCode(200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAdditionalFeeRequest $request)
    {
        try {
            DB::beginTransaction();
            $created = $this->additionalFeeService->createAdditionalFee($request->validated());
            DB::commit();

            return (new AdditionalFeeResource($created))
                ->additional([
                    'message' => 'Additional fee added successfully'
                ])->response()
                ->setStatusCode(201);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to add additional fee',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdditionalFeeRequest $request, AdditionalFee $additionalFee)
    {
        try {
            DB::beginTransaction();
            $updated = $this->additionalFeeService->updateAdditionalFee($additionalFee, $request->validated());
            DB::commit();

            return (new AdditionalFeeResource($updated))
                ->additional([
                    'message' => 'Additional fee updated successfully'
                ])->response()
                ->setStatusCode(200);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to update additional fee',
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AdditionalFee $additionalFee)
    {
        try {
            DB::beginTransaction();
            $deleted = $this->additionalFeeService->deleteAdditionalFee($additionalFee);
            DB::commit();

            return (new AdditionalFeeResource($deleted))
                ->additional([
                    'message' => 'Additional fee deleted successfully'
                ])->response()
                ->setStatusCode(200);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to delete additional fee',
                'error' => $e->getMessage(),
            ]);
        }
    }
}
