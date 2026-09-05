<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContractorRejectedNotification extends Notification
{
    use Queueable;

    public function __construct()
    {
        //
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $name = $notifiable->name ?? 'Contractor';

        return (new MailMessage)
            ->subject('Application Status Update - RepairLink')
            ->greeting("Hello {$name},")
            ->line('Thank you for your interest in joining our platform.')
            ->line('After reviewing your submitted credentials and documentation, we regret to inform you that your contractor application has not been approved at this time.')
            ->line('If you believe this decision was made in error or would like to submit updated credentials, please feel free to reach out to our support team.')
            ->action('Contact Support', url('/contact'))
            ->line('Thank you for your time and understanding.');
    }

    public function toArray($notifiable)
    {
        return [];
    }
}