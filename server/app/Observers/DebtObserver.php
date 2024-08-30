<?php

namespace App\Observers;

use App\Enums\InstallmentStatusEnum;
use App\Models\Debt;
use App\Models\Member;
use App\Models\Balance;
use App\Models\Installment;

class DebtObserver
{
    /**
     * Handle the Debt "created" event.
     *
     * @param  \App\Models\Debt  $debt
     * @return void
     */
    public function created(Debt $debt)
    {
        $duration = $debt->months;
        $amount = $debt->amount;
        $interestRate = $debt->interest_rate;

        $interest = $amount * $interestRate / 100;

        $totalAmount = $amount + $interest;
        $installmentAmount = $totalAmount / $duration;

        $dueDate = now()->addMonth();


        $installments = [];
        $remaining = $totalAmount;
        for ($i = 1; $i <= $duration; $i++) {
            $reference = 'AS' . $debt->member_id . $dueDate->format('Ymd');

            $installments[] = [
                'reference' => $reference,
                'member_id' => $debt->member_id,
                'principal' => $installmentAmount,
                'interest' => $interest / $duration,
                'remaining' => $remaining,
                'month' => $i,
                'due_date' => $dueDate,
                'status' => InstallmentStatusEnum::PENDING,
            ];

            $dueDate = $dueDate->addMonth();
            $remaining -= $installmentAmount;
        }

        Installment::insert($installments);
    }

    /**
     * Handle the Debt "updated" event.
     *
     * @param  \App\Models\Debt  $debt
     * @return void
     */
    public function updated(Debt $debt)
    {
        //
    }

    /**
     * Handle the Debt "deleted" event.
     *
     * @param  \App\Models\Debt  $debt
     * @return void
     */
    public function deleted(Debt $debt) {}

    /**
     * Handle the Debt "restored" event.
     *
     * @param  \App\Models\Debt  $debt
     * @return void
     */
    public function restored(Debt $debt)
    {
        //
    }

    /**
     * Handle the Debt "force deleted" event.
     *
     * @param  \App\Models\Debt  $debt
     * @return void
     */
    public function forceDeleted(Debt $debt)
    {
        //
    }
}