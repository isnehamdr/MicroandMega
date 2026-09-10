<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AdminAlertNotification extends Notification
{
    use Queueable;

    /**
     * @param string $type     Short machine key, e.g. 'low_stock', 'new_order'
     * @param string $message  Human-readable text shown in the bell dropdown
     * @param string $link     Where clicking the notification should go
     * @param array  $data     Any extra structured data you want stored (product id, order id, etc.)
     * @param string|null $mailSubject  If null, mail is skipped entirely
     */
    public function __construct(
        public string $type,
        public string $message,
        public string $link = '/',
        public array $data = [],
        public ?string $mailSubject = null
    ) {
    }

    public function via($notifiable): array
    {
        return $this->mailSubject ? ['database', 'mail'] : ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return array_merge([
            'type'    => $this->type,
            'message' => $this->message,
            'link'    => $this->link,
        ], $this->data);
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject($this->mailSubject ?? $this->message)
            ->line($this->message)
            ->action('View Details', url($this->link));
    }
}